from sqlalchemy import text
from common.db import Connection

import numpy as np
import pandas as pd


TABLE = "vehicles_average_mileage_by_region"


def vehicles_average_mileage_by_region(db: Connection):
    records = db.conn.execute(
        text(
            f"""SELECT i.year, s.nuts3, SUM(i.mileage) / SUM(1) AS average_mileage
FROM
	(
		SELECT DISTINCT ON (year, vin) date_part('year', date) as year, vin, station_id, mileage
	 	FROM inspections
	) AS i
	JOIN stations AS s
	ON i.station_id = s.id
    JOIN vehicles v ON i.vin = v.vin
WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
GROUP BY i.year, s.nuts3
ORDER BY i.year ASC, s.nuts3 ASC"""
        )
    ).all()

    # Pivot table so it has years in rows and drive types in columns.

    # Load nut3 from DB.
    nuts3_all = db.conn.execute(
        text(
            f"""SELECT DISTINCT nuts3
FROM stations
WHERE nuts3 IS NOT NULL"""
        )
    ).all()
    nuts3_all = np.array(nuts3_all)[:, 0].flatten()

    # Initialize a table with years in rows and drive types in columns.
    start_year = int(records[0][0])
    end_year = int(records[-1][0] + 1)  # exclusive range
    years = list(range(start_year, end_year))
    table = {nuts3: [0 for _ in range(start_year, end_year)] for nuts3 in nuts3_all}
    table["year"] = years

    for row in records:
        year = int(row[0])
        nuts3 = row[1]
        avg = int(float(row[2]))

        # Add current column.
        i = years.index(year)
        table[nuts3][i] = avg

    df = pd.DataFrame(table)

    db.write(TABLE, df)
