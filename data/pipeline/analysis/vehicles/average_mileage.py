from sqlalchemy import text
from common.db import Connection

import numpy as np
import pandas as pd


TABLE = "vehicles_average_mileage"


def vehicles_average_mileage(db: Connection):
    records = db.conn.execute(
        text(
            f"""SELECT i.year, SUM(i.mileage) / SUM(1) AS average_mileage
FROM
	(
		SELECT DISTINCT ON (year, vin) date_part('year', date) as year, vin, mileage
	 	FROM inspections
	) AS i
    JOIN vehicles v ON i.vin = v.vin
WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
GROUP BY i.year
ORDER BY i.year ASC"""
        )
    ).all()

    records = np.array(records)

    df = pd.DataFrame(
        {
            "year": records[:, 0].flatten().astype(float).astype(int),
            "average_mileage": records[:, 1].flatten().astype(float).astype(int),
        }
    )

    db.write(TABLE, df)
