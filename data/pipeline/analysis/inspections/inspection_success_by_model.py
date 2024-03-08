import numpy as np
import pandas as pd
from sqlalchemy import text

from common.db import Connection
from ingestion.inspections.main import get_last_record_date


TABLE = "stations_inspection_success_by_model"


def stations_inspection_success_by_model(db: Connection):
    last_record = get_last_record_date(db)
    years = range(2018, last_record.year + 1)
    table = {
        "year": [],
        "model": [],
        "0": [],
        "1": [],
        "2": [],
        "total": [],
    }

    for year in years:
        # Get their inspection result counts.
        records = db.conn.execute(
            text(
                f"""SELECT i.make, i.model_primary, i.result, count(1)
FROM inspections i
WHERE date_part('year', i.date) = {year}
    AND i.make IN (
        SELECT make
        FROM vehicles v
        WHERE make IS NOT NULL
        GROUP BY make
        ORDER BY count(1) DESC
        LIMIT 150
    )
    AND i.model_primary IN (
        SELECT model_primary
        FROM vehicles v
        WHERE model_primary IS NOT NULL
        GROUP BY model_primary
        ORDER BY count(1) DESC
        LIMIT 150
    )
GROUP BY i.make, i.model_primary, i.result"""
            )
        ).all()

        records = np.array(records)

        records = pd.DataFrame(
            {
                "make": records[:, 0],
                "model_primary": records[:, 1],
                "result": records[:, 2],
                "count": records[:, 3],
            }
        )
        records["count"] = records["count"].astype(int)

        makes = records["make"].unique()

        # Find inspection counts by result for each make.
        for make in makes:
            models = records[records["make"] == make]["model_primary"].unique()

            for model in models:
                table["year"].append(year)
                table["model"].append(make + " " + model)

                count_0_filtered = records[
                    (records["make"] == make)
                    & (records["model_primary"] == model)
                    & (records["result"] == "0")
                ]["count"]
                if count_0_filtered.size == 0:
                    count_0 = 0
                else:
                    count_0 = count_0_filtered.iloc[0]

                count_1_filtered = records[
                    (records["make"] == make)
                    & (records["model_primary"] == model)
                    & (records["result"] == "1")
                ]["count"]
                if count_1_filtered.size == 0:
                    count_1 = 0
                else:
                    count_1 = count_1_filtered.iloc[0]

                count_2_filtered = records[
                    (records["make"] == make)
                    & (records["model_primary"] == model)
                    & (records["result"] == "2")
                ]["count"]
                if count_2_filtered.size == 0:
                    count_2 = 0
                else:
                    count_2 = count_2_filtered.iloc[0]

                table["0"].append(count_0)
                table["1"].append(count_1)
                table["2"].append(count_2)
                table["total"].append(count_0 + count_1 + count_2)

    df = pd.DataFrame(table)

    db.write(TABLE, df)
