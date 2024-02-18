from sqlalchemy import text
from common.db import Connection

import numpy as np
import pandas as pd

from ingestion.inspections.main import get_last_record_date


def vehicles_operating_state(db: Connection):
    # Init result table.
    table = {}
    last_record = get_last_record_date(db.conn)
    table["year"] = range(1990, last_record.year + 1)

    # Load states from DB.
    operating_states = db.conn.execute(
        text(
            f"""SELECT DISTINCT operating_state
FROM vehicles
WHERE operating_state IS NOT NULL"""
        )
    ).all()
    operating_states = np.array(operating_states)[:, 0].flatten()

    for operating_state in operating_states:
        table[operating_state] = []

    # Load data from DB.
    for year in table["year"]:
        records = db.conn.execute(
            text(
                f"""SELECT date_part('year', first_registration_cz) as year, operating_state, count(1)
FROM vehicles
WHERE first_registration_cz >= '{year}-01-01'
  AND first_registration_cz < '{year + 1}-01-01'
  AND first_registration_cz IS NOT NULL
GROUP BY year, operating_state
ORDER BY year"""
            )
        ).all()

        for record in records:
            if record[2] != None:  # Skip missing color count.
                table[record[1]].append(record[2])

    df = pd.DataFrame(table)

    db.write("vehicles_operating_state", df)

    db.conn.commit()
