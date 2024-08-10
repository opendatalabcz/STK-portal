from sqlalchemy import text
from common.db import Connection

import pandas as pd


def vehicles_drive_type(db: Connection):
    # Load data from DB.
    records = db.conn.execute(
        text(
            f"""SELECT date_part('year', first_registration_cz) as year, drive_type, count(1)
FROM vehicles
WHERE first_registration_cz IS NOT NULL AND drive_type IS NOT NULL
GROUP BY year, drive_type"""
        )
    ).all()

    # Initialize a table with years in rows and drive types in columns.
    start_year = int(records[0][0])
    end_year = int(records[-1][0] + 1)  # exclusive range
    years = list(range(start_year, end_year))

    general_table = {
        drive_type: [0 for _ in range(start_year, end_year)]
        for drive_type in [
            "benzin",
            "nafta",
            "elektrifikovane",
            "plyn",
            "ostatni",
        ]
    }
    general_table["year"] = years

    electric_table = {
        drive_type: [0 for _ in range(start_year, end_year)]
        for drive_type in ["elektropohon", "nafta_hybrid", "benzin_hybrid"]
    }
    electric_table["year"] = years

    for row in records:
        year = int(row[0])
        raw_drive_type = row[1]
        count = row[2]

        i = years.index(year)

        general_drive_type = None
        electric_drive_type = None
        if "Elektropohon" in raw_drive_type:
            general_drive_type = "elektrifikovane"

            if "Benzin" in raw_drive_type:
                electric_drive_type = "benzin_hybrid"
            elif "Nafta" in raw_drive_type:
                electric_drive_type = "nafta_hybrid"
            else:
                electric_drive_type = "elektropohon"

            electric_table[electric_drive_type][i] += count
        elif (
            "LPG" in raw_drive_type
            or "CNG" in raw_drive_type
            or "LNG" in raw_drive_type
            or "Vodík" in raw_drive_type
            or "Metan" in raw_drive_type
        ):
            general_drive_type = "plyn"
        elif "Benzin" in raw_drive_type:
            general_drive_type = "benzin"
        elif "Nafta" in raw_drive_type:
            general_drive_type = "nafta"
        else:
            general_drive_type = "ostatni"

        general_table[general_drive_type][i] += count

    general_df = pd.DataFrame(general_table)
    db.write("vehicles_drive_type", general_df)
    electric_df = pd.DataFrame(electric_table)
    db.write("vehicles_electric_drive_type", electric_df)

    db.conn.commit()
