from datetime import date
from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = "vehicles_average_age"


def vehicles_average_age(db: Connection):
    # Load data from DB.
    means = []

    last_record = get_last_record_date(db)

    # Get an average for each year.
    years = range(2020, last_record.year + 1)
    for year in years:
        # Load all unique vehicles inspected that year.
        records = db.conn.execute(
            text(
                f"""SELECT AVG(('{year}-12-31' - v.first_registration) / 365.25) 
FROM vehicles v
	LEFT JOIN vehicles_estimated_end_of_life e ON v.vin = e.vin
WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
    AND (
			(v.operating_state = 'PROVOZOVANÉ' AND v.first_registration <= '{year}-12-31')
			OR
			(v.operating_state <> 'PROVOZOVANÉ' AND e.estimated_end_of_life >= '{year}-01-01')
		)"""
            )
        ).all()

        mean = float(np.array(records)[0, 0])
        means.append(mean)

    df = pd.DataFrame(
        {
            "year": years,
            "mean": means,
        }
    )

    db.write(TABLE, df)
