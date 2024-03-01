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


# def vehicles_average_age(db: Connection):
#     # Load data from DB.
#     means = []

#     last_record = get_last_record_date(db.conn)

#     # Get an average for each year.
#     years = range(2018, last_record.year + 1)
#     for year in years:
#         # Load all unique vehicles inspected that year.
#         records = db.conn.execute(
#             text(
#                 f"""SELECT DISTINCT v.vin, v.first_registration
# FROM inspections i
# 	JOIN vehicles v ON i.vin = v.vin
# WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
#     AND i.date >= \'{year}-01-01\' AND i.date < \'{year + 1}-01-01\'
# 	AND i.inspection_type IN ('regular', 'evidence')"""
#             )
#         ).all()
#         registration_dates = np.array(records)[:, 1].flatten()

#         # Get vehicle ages as decimal year counts related to the last day
#         # of the year (because some vehicles would have negative age if
#         # we related it to the middle of the year).
#         # Weigh them with the frequency of their inspections.
#         end_of_year = date(year=year, month=12, day=31)
#         ages = []
#         for x in registration_dates:
#             if x is not None:
#                 age = (end_of_year - x).days / 365.25
#                 ages.append(age)

#         ages = np.array(ages)
#         means.append(ages.mean())

#     df = pd.DataFrame(
#         {
#             "year": years,
#             "mean": means,
#         }
#     )

#     db.write(TABLE, df)
