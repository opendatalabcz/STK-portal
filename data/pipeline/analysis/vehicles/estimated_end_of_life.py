from datetime import date
from sqlalchemy import text
from common.db import Connection

import pandas as pd


TABLE = "vehicles_estimated_end_of_life"


def vehicles_estimated_end_of_life(db: Connection):
    # Load data from DB.
    table = {
        "vin": [],
        "last_inspection_id": [],
        "estimated_end_of_life": [],
    }

    records = db.conn.execute(
        text(
            f"""SELECT DISTINCT ON (v.vin)
	v.vin, i.id, i.date, i.result
FROM vehicles v
	JOIN inspections i ON i.vin = v.vin
WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
	AND (v.operating_state <> 'PROVOZOVANÉ')
ORDER BY v.vin, i.date DESC"""
        )
    ).all()

    for record in records:
        table["vin"].append(record[0])
        table["last_inspection_id"].append(int(record[1]))

        last_inspection_date = record[2]
        last_inspection_result = int(record[3])
        if last_inspection_result == 0:
            table["estimated_end_of_life"].append(
                date(year=last_inspection_date.year + 1, month=12, day=31)
            )
        else:
            table["estimated_end_of_life"].append(last_inspection_date)

    df = pd.DataFrame(table)

    db.write(TABLE, df)
