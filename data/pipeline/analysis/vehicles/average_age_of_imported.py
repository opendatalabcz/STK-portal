from datetime import date
from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = "vehicles_average_age_of_imported"


def vehicles_average_age_of_imported(db: Connection):
    # Load data from DB.
    means = []

    last_record = get_last_record_date(db.conn)

    # Get an average for each year.
    years = range(2000, last_record.year + 1)
    for year in years:
        records = db.conn.execute(
            text(
                f"""SELECT AVG('{year}-12-31' - first_registration) / 365.25
FROM vehicles
WHERE primary_type = 'OSOBNÍ AUTOMOBIL'
  AND first_registration_cz - first_registration > 365
	AND date_part('year', first_registration_cz) = {year}"""
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
