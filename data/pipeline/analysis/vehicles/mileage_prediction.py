from catboost import CatBoostRegressor
import numpy as np
import os
import pandas as pd
from sqlalchemy import Connection as SqlAlchemyConnection, text

from common.db import Connection
from .defect_prediction import add_drive_type_features, impute_missing_values, load_data


def predict(X: pd.DataFrame, model_path: str):
    model = CatBoostRegressor()
    model.load_model(model_path)

    pred = model.predict(X, prediction_type="RawFormulaVal")

    return pred


def pipeline(conn: SqlAlchemyConnection, offset: int, limit: int, model_path: str):
    print("    - Loading")
    # Load batch.
    df = load_data(conn, offset, limit)

    # Preprocess data.
    df = add_drive_type_features(df)
    df = impute_missing_values(df)
    df = df.dropna(axis=0, how="any", subset=["motor_power", "motor_volume"])
    vin = df["vin"]
    current_mileage = df["mileage"]
    X = df = df.drop(columns=["vin", "drive_type"])

    print("    - Predicting")
    # Predict.
    predicted_mileage_increase = predict(X, model_path)
    predicted_mileage_increase = pd.Series(predicted_mileage_increase)
    predicted_mileage_increase.mask(lambda x: x <= 0)  # type: ignore

    # Assemble dataframe with predictions and write to DB.
    result = pd.concat(
        [vin, current_mileage, current_mileage + predicted_mileage_increase], axis=1
    )
    result.columns = ["vin", "current_mileage", "future_mileage"]
    result["incorrect"] = result["future_mileage"] <= result["current_mileage"]
    result["incorrect"] = result["incorrect"].mask(lambda x: x == True)  # type: ignore
    result = result.dropna()
    result = result.drop(columns=["current_mileage", "incorrect"])

    print("    - Saving")
    result.to_sql(
        con=conn, name="vehicles_mileage_prediction", if_exists="append", index=False
    )
    conn.commit()


def vehicles_mileage_prediction(conn: Connection):
    # Get model paths.
    model_path = os.environ["PRECOMPUTED_DATA"] + "/mileage_prediction/model"

    # Clear table.
    conn.conn.execute(text("DROP TABLE IF EXISTS vehicles_mileage_prediction"))

    # Get total amount of data.
    records = conn.conn.execute(
        text("SELECT count(*) FROM common_vehicle_last_inspections")
    ).all()
    total_data = np.array(records)[0, 0]

    # Predict in batches.
    processed = 0
    batch_size = 1000000
    while processed < total_data:
        print(f"  - Processed {processed} out of {total_data} vehicles")
        pipeline(
            conn=conn.conn, offset=processed, limit=batch_size, model_path=model_path
        )
        processed += batch_size

    conn.grant_api_rights("vehicles_mileage_prediction")
