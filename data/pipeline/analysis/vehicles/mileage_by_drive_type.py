from sqlalchemy import text
from common.db import Connection

import numpy as np
import pandas as pd


TABLE = "vehicles_mileage_by_drive_type"


def vehicles_mileage_by_drive_type(db: Connection):
    # Load data from DB.
    records = db.conn.execute(
        text(
            f"""SELECT i.year, v.drive_type, SUM(i.mileage) AS mileage
FROM
	(
		SELECT DISTINCT ON (year, vin) date_part('year', date) as year, vin, mileage
	 	FROM inspections
	) AS i
	JOIN vehicles AS v
	ON i.vin = v.vin
WHERE v.drive_type IS NOT NULL
GROUP BY i.year, v.drive_type
ORDER BY i.year ASC, v.drive_type ASC"""
        )
    ).all()

    # Pivot table so it has years in rows and drive types in columns.

    # Initialize a table with years in rows and drive types in columns.
    start_year = int(records[0][0])
    end_year = int(records[-1][0] + 1)  # exclusive range
    years = list(range(start_year, end_year))
    table = {
        drive_type: [0 for _ in range(start_year, end_year)]
        for drive_type in [
            "benzin",
            "nafta",
            "elektrifikovane",
            "plyn",
            "ostatni",
        ]
    }
    table["year"] = years

    for row in records:
        year = int(row[0])
        raw_drive_type = row[1]
        count = row[2]

        i = years.index(year)

        drive_type = None
        if "Elektropohon" in raw_drive_type:
            drive_type = "elektrifikovane"
        elif (
            "LPG" in raw_drive_type
            or "CNG" in raw_drive_type
            or "LNG" in raw_drive_type
            or "Vodík" in raw_drive_type
            or "Metan" in raw_drive_type
        ):
            drive_type = "plyn"
        elif "Benzin" in raw_drive_type:
            drive_type = "benzin"
        elif "Nafta" in raw_drive_type:
            drive_type = "nafta"
        else:
            drive_type = "ostatni"

        table[drive_type][i] += count

    df = pd.DataFrame(table)

    db.write(TABLE, df)
