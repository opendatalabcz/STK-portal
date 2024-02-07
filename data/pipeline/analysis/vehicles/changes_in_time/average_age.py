from datetime import date
from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = "vehicles_changes_in_time_average_age"


def vehicles_changes_in_time_average_age(db: Connection):
    # Load data from DB.
    means = []

    last_record = get_last_record_date(db.conn)

    # Get an average for each year.
    # ~Skip 2018 due to uncomparable data.~
    years = range(2018, last_record.year + 1)
    for year in years:
        # Load all unique vehicles inspected that year.
        records = db.conn.execute(
            text(
                f"""SELECT DISTINCT v.vin, v.first_registration
FROM inspections i
	JOIN vehicles v ON i.vin = v.vin
WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
    AND i.date >= \'{year}-01-01\' AND i.date < \'{year + 1}-01-01\'
	AND i.inspection_type IN ('regular', 'evidence')"""
            )
        ).all()
        registration_dates = np.array(records)[:, 1].flatten()

        # Get vehicle ages as decimal year counts related to the last day
        # of the year (because some vehicles would have negative age if
        # we related it to the middle of the year).
        end_of_year = date(year=year, month=12, day=31)
        ages = []
        for x in registration_dates:
            if x is not None:
                ages.append((end_of_year - x).days / 365.25)

        ages = np.array(ages)
        means.append(ages.mean())

    df = pd.DataFrame(
        {
            "year": years,
            "mean": means,
        }
    )

    db.write(TABLE, df)
