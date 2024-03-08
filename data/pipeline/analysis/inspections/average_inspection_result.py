from sqlalchemy import text
from common.db import Connection

import pandas as pd

from ingestion.inspections.main import get_last_record_date


TABLE = "stations_average_inspection_result"


def stations_average_inspection_result(db: Connection):
    last_record = get_last_record_date(db)

    table = {}
    table["year"] = range(2018, last_record.year + 1)
    for result in ["0", "1", "2"]:
        table[result] = []

    for year in table["year"]:
        records = db.conn.execute(
            text(
                f"""SELECT result, COUNT(*)
FROM inspections
WHERE date_part('year', date) = {year}
GROUP BY result
ORDER BY result ASC"""
            )
        ).all()

        table["0"].append(records[0][1])
        table["1"].append(records[1][1])
        table["2"].append(records[2][1])

    df = pd.DataFrame(table)

    db.write(TABLE, df)
