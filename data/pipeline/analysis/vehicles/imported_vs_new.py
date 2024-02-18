from datetime import date
from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = "vehicles_imported_vs_new"


def vehicles_imported_vs_new(db: Connection):
    # Load data from DB.
    amounts_imported = []
    amounts_new = []

    last_record = get_last_record_date(db.conn)

    # Get an average for each year.
    years = range(2000, last_record.year + 1)
    for year in years:
        records = db.conn.execute(
            text(
                f"""SELECT SUM(1)
FROM vehicles v
WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
  AND v.first_registration_cz - v.first_registration > 365
	AND date_part('year', v.first_registration_cz) = {year}"""
            )
        ).all()

        amount = float(np.array(records)[0, 0])
        amounts_imported.append(amount)

        records = db.conn.execute(
            text(
                f"""SELECT SUM(1)
FROM vehicles v
WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
  AND v.first_registration_cz - v.first_registration <= 365
	AND date_part('year', v.first_registration_cz) = {year}"""
            )
        ).all()

        amount = float(np.array(records)[0, 0])
        amounts_new.append(amount)

    df = pd.DataFrame(
        {
            "year": years,
            "amount_imported": amounts_imported,
            "amount_new": amounts_new,
        }
    )

    db.write(TABLE, df)
