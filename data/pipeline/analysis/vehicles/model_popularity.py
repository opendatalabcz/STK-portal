from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = "vehicles_model_popularity"


def vehicles_model_popularity(db: Connection):
    # Load models from DB.
    models = db.conn.execute(
        text(
            f"""SELECT DISTINCT make, model_primary
FROM vehicles
WHERE make IS NOT NULL
    AND model_primary IS NOT NULL"""
        )
    ).all()
    models = [model[0] + " " + model[1] for model in models]

    # Init result table.
    table = {}
    last_record = get_last_record_date(db.conn)
    table["year"] = range(1990, last_record.year + 1)

    for model in models:
        table[model] = []

    # Get counts of colors for vehicles in each year.
    for index, year in enumerate(table["year"]):
        # Load all unique vehicles inspected that year.
        records = db.conn.execute(
            text(
                f"""SELECT make, model_primary, count(1)
FROM vehicles
WHERE first_registration >= '{year}-01-01'
  AND first_registration < '{year + 1}-01-01'
GROUP BY make, model_primary"""
            )
        ).all()

        for record in records:
            if record[0] != None and record[1] != None:  # Skip unknown.
                table[record[0] + " " + record[1]].append(record[2])

        # Add missing counts.
        for model in models:
            if len(table[model]) != index + 1:
                table[model].append(0)

    df = pd.DataFrame(table)

    db.write(TABLE, df)
