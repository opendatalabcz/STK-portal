from catboost import CatBoostClassifier
import numpy as np
import os
import pandas as pd
from sqlalchemy import Connection as SqlAlchemyConnection, text

from common.db import Connection


def prepare_data(conn: SqlAlchemyConnection):
    conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.common_vehicle_last_inspections;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.common_vehicle_last_inspections
TABLESPACE pg_default
AS
 SELECT
      DISTINCT ON (i1.vin)
    i1.vin,
    i1.make,
    i1.model_primary,
    v.motor_power,
    v.motor_volume,
    v.drive_type,
    i1.result,
    i1.mileage,
    i1.vehicle_age,
    i1.defects_a,
    i1.defects_b,
    i1.defects_c,
    i1.defects_0,
    i1.defects_1,
    i1.defects_2,
    i1.defects_3,
    i1.defects_4,
    i1.defects_5,
    i1.defects_6,
    i1.defects_7,
    i1.defects_8,
    i1.defects_9
  FROM
      inspections i1
  LEFT OUTER JOIN inspections i2 ON
      i1.vin = i2.vin AND
      i1.date < i2.date
  JOIN vehicles v ON i1.vin = v.vin
  WHERE
      i2.vin IS NULL
    AND (
        (v.make, v.model_primary) IN (
        SELECT DISTINCT x.make, x.model_primary
        FROM (
          SELECT inspections.make, inspections.model_primary, count(*) AS c
          FROM inspections
          WHERE date_part('year'::text, inspections.date) >= 2019::double precision
          GROUP BY inspections.make, inspections.model_primary
          HAVING count(*) >= 1000
          ORDER BY (count(*)) DESC) x)
          )
    AND (i1.inspection_type = 'regular'::text OR i1.inspection_type = 'evidence'::text) AND date_part('year'::text, i1.date) >= 2019::double precision
  ORDER BY i1.vin ASC, i1.date ASC
WITH DATA;"""
        )
    )


def load_data(conn: SqlAlchemyConnection, offset: int, limit: int):
    records = conn.execute(
        text(
            f"""SELECT * FROM common_vehicle_last_inspections
            ORDER BY vin
            LIMIT {limit} OFFSET {offset}"""
        )
    ).all()

    data = pd.DataFrame(np.array(records).reshape((-1, 22)))

    data.columns = [
        "vin",
        "make",
        "model_primary",
        "motor_power",
        "motor_volume",
        "drive_type",
        "result",
        "mileage",
        "vehicle_age",
        "defects_a",
        "defects_b",
        "defects_c",
        "defects_0",
        "defects_1",
        "defects_2",
        "defects_3",
        "defects_4",
        "defects_5",
        "defects_6",
        "defects_7",
        "defects_8",
        "defects_9",
    ]

    for col, dt in zip(
        data.columns,
        [
            "object",
            "category",
            "category",
            np.float32,
            np.float32,
            "object",
            "category",
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
            np.float32,
        ],
    ):
        data[col] = data[col].astype(dt)  # type: ignore

    return data


def add_drive_type_features(df: pd.DataFrame):

    def drive_type_flags(row):
        data = str(row["drive_type"])

        benzin = False
        nafta = False
        elektropohon = False
        plyn = False

        if "Benzin" in data:
            benzin = True

        if "Nafta" in data:
            nafta = True

        if (
            "LPG" in data
            or "CNG" in data
            or "LNG" in data
            or "BIO Metan" in data
            or "Vodík" in data
        ):
            plyn = True

        if "Elektropohon" in data:
            elektropohon = True

        return (benzin, nafta, elektropohon, plyn)

    df[["benzin", "nafta", "elektropohon", "plyn"]] = df.apply(
        drive_type_flags, axis=1, result_type="expand"
    )

    return df


def impute_missing_values(df: pd.DataFrame):
    df["motor_power"] = df.groupby(["make", "model_primary"], observed=False)[
        "motor_power"
    ].transform(lambda x: x.fillna(np.mean(x)))
    df["motor_volume"] = df.groupby(["make", "model_primary"], observed=False)[
        "motor_volume"
    ].transform(lambda x: x.fillna(np.mean(x)))
    return df


def predict(X: pd.DataFrame, model_paths: list[str]):
    preds = []

    for model_path in model_paths:
        print("    " + model_path)
        model = CatBoostClassifier()
        model.load_model(model_path)

        pred = model.predict(X, prediction_type="Probability")
        preds.append(pred)

    return preds


def pipeline(
    conn: SqlAlchemyConnection, offset: int, limit: int, model_paths: list[str]
):
    print("    - Loading")
    # Load batch.
    df = load_data(conn, offset, limit)

    # print("  preprocess")
    # Preprocess data.
    df = add_drive_type_features(df)
    df = impute_missing_values(df)
    df = df.dropna(axis=0, how="any", subset=["motor_power", "motor_volume"])
    vin = df["vin"]
    df = df.drop(columns=["vin", "drive_type"])

    print("    - Predicting")
    # Predict.
    preds = predict(df, model_paths)

    # Assemble dataframe with predictions and write to DB.
    # print("  assemble")
    result = pd.concat(
        [vin] + [pd.Series(np.array(pred)[:, 1]) for pred in preds], axis=1
    )
    result.columns = ["vin"] + [f"future_defect_prob_{i}" for i in range(0, len(preds))]
    print("    - Saving")
    result.to_sql(
        con=conn, name="vehicles_defect_prediction", if_exists="append", index=False
    )
    # print("  commit")
    conn.commit()


def vehicles_defect_prediction(conn: Connection):
    prepare_data(conn.conn)
    conn.conn.commit()

    # Get model paths.
    data_dir = (
        os.environ["PRECOMPUTED_DATA"] + "/defect_prediction/"
        if "PRECOMPUTED_DATA" in os.environ
        else "data/precomputed/defect_prediction/"
    )
    model_paths = [data_dir + f"model_{i}" for i in range(0, 7)]

    # Clear table.
    conn.conn.execute(text("DROP TABLE IF EXISTS vehicles_defect_prediction"))

    # Get total amount of data.
    records = conn.conn.execute(
        text("SELECT count(*) FROM common_vehicle_last_inspections")
    ).all()
    total_data = np.array(records)[0, 0]

    # Predict in batches.
    processed = 0
    batch_size = 1000000
    while processed < total_data:
        print(f"  - Processed {processed} out of {total_data} records")
        pipeline(
            conn=conn.conn, offset=processed, limit=batch_size, model_paths=model_paths
        )
        processed += batch_size

    conn.grant_api_rights("vehicles_defect_prediction")
    conn.conn.commit()
