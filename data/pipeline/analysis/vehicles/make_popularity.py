from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = "vehicles_make_popularity"


def vehicles_make_popularity(db: Connection):
    # Load makes from DB.
    makes = db.conn.execute(
        text(
            f"""SELECT DISTINCT make
FROM vehicles
WHERE make IS NOT NULL"""
        )
    ).all()
    makes = np.array(makes)[:, 0].flatten()

    # Init result table.
    table = {}
    last_record = get_last_record_date(db.conn)
    table["year"] = range(1990, last_record.year + 1)

    for make in makes:
        table[make] = []

    # Get counts of colors for vehicles in each year.
    for index, year in enumerate(table["year"]):
        # Load all unique vehicles inspected that year.
        records = db.conn.execute(
            text(
                f"""SELECT make, count(1)
FROM vehicles
WHERE first_registration >= '{year}-01-01'
  AND first_registration < '{year + 1}-01-01'
GROUP BY make"""
            )
        ).all()

        for record in records:
            if record[0] != None:  # Skip unknown make.
                table[record[0]].append(record[1])

        # Add missing counts.
        for make in makes:
            if len(table[make]) != index + 1:
                table[make].append(0)

    df = pd.DataFrame(table)

    db.write(TABLE, df)
