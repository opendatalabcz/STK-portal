from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import pandas as pd


TABLE = "vehicles_colors"


def vehicles_colors(db: Connection):
    # Init result table.
    table = {}
    last_record = get_last_record_date(db)
    table["year"] = range(1990, last_record.year + 1)

    colors = [
        "ORANŽOVÁ",
        "ŠEDÁ",
        "ŽLUTÁ",
        "MODRÁ",
        "ČERNÁ",
        "ZELENÁ",
        "BÍLÁ",
        "ČERVENÁ",
        "FIALOVÁ",
        "HNĚDÁ",
    ]
    for color in colors:
        table[color] = []

    # Get counts of colors for vehicles in each year.
    for year in table["year"]:
        # Load all unique vehicles inspected that year.
        records = db.conn.execute(
            text(
                f"""SELECT color, count(1)
FROM vehicles
WHERE first_registration >= '{year}-01-01'
  AND first_registration < '{year + 1}-01-01'
GROUP BY color"""
            )
        ).all()

        for record in records:
            if record[0] != None:  # Skip missing color count.
                table[record[0]].append(record[1])

    df = pd.DataFrame(table)

    db.write(TABLE, df)
