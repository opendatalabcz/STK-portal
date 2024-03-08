import numpy as np
import pandas as pd
from sqlalchemy import text

from common.db import Connection
from ingestion.inspections.main import get_last_record_date


TABLE = "stations_inspection_success_by_make"


def stations_inspection_success_by_make(db: Connection):
    last_record = get_last_record_date(db)
    years = range(2018, last_record.year + 1)
    table = {
        "year": [],
        "make": [],
        "0": [],
        "1": [],
        "2": [],
        "total": [],
    }

    for year in years:
        # Get their inspection result counts.
        records = db.conn.execute(
            text(
                f"""SELECT i.make, i.result, count(1)
FROM inspections i
WHERE date_part('year', i.date) = {year}
GROUP BY i.make, i.result"""
            )
        ).all()

        records = np.array(records)

        records = pd.DataFrame(
            {
                "make": records[:, 0],
                "result": records[:, 1],
                "count": records[:, 2],
            }
        )
        records["count"] = records["count"].astype(int)

        makes = records["make"].unique()

        # Find inspection counts by result for each make.
        for make in makes:
            table["year"].append(year)
            table["make"].append(make)

            count_0_filtered = records[
                (records["make"] == make) & (records["result"] == "0")
            ]["count"]
            if count_0_filtered.size == 0:
                count_0 = 0
            else:
                count_0 = count_0_filtered.iloc[0]

            count_1_filtered = records[
                (records["make"] == make) & (records["result"] == "1")
            ]["count"]
            if count_1_filtered.size == 0:
                count_1 = 0
            else:
                count_1 = count_1_filtered.iloc[0]

            count_2_filtered = records[
                (records["make"] == make) & (records["result"] == "2")
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
