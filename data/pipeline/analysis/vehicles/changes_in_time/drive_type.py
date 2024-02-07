from sqlalchemy import text
from common.db import Connection

import numpy as np
import pandas as pd


def vehicles_changes_in_time_drive_type(db: Connection):
    pass

    # Load data from DB.
    records = db.conn.execute(
        text(
            f"""SELECT date_part('year', first_registration_cz) as year, drive_type, count(1)
FROM vehicles
WHERE first_registration_cz IS NOT NULL AND drive_type IS NOT NULL
GROUP BY year, drive_type"""
        )
    ).all()

    # Load drive types from DB.
    drive_types = db.conn.execute(
        text(
            f"""SELECT DISTINCT drive_type
FROM vehicles
WHERE drive_type IS NOT NULL"""
        )
    ).all()
    drive_types = np.array(drive_types)[:, 0].flatten()

    # Initialize a table with years in rows and drive types in columns.
    start_year = int(records[0][0])
    end_year = int(records[-1][0] + 1)  # exclusive range
    years = list(range(start_year, end_year))
    table = {
        drive_type: [0 for _ in range(start_year, end_year)]
        for drive_type in drive_types
    }
    table["year"] = years

    for row in records:
        year = int(row[0])
        drive_type = row[1]
        count = row[2]

        # Add current column.
        i = years.index(year)
        table[drive_type][i] = count

    df = pd.DataFrame(table)

    # Aggregate columns.
    general(df, db)
    electric(df, db)

    db.conn.commit()


def general(df: pd.DataFrame, db: Connection):
    # - pouze benzin
    # - pouze nafta nebo bio nafta
    # - obsahuje elektro
    # - obsahuje plyn (CNG, LPG, LNG) ale ne elektro
    # - ostatni

    year = df["year"]
    benzin = df["Benzin"]
    nafta = df[["Nafta", "BIO Nafta"]].sum(axis=1)
    elektro = df[
        [
            "Elektropohon",
            "(Elektropohon,Nafta)",
            "(Benzin,Elektropohon,LPG)",
            "(Benzin,Elektropohon)",
        ]
    ].sum(axis=1)
    plyn = df[
        [
            "LPG",
            "(Benzin,LPG)",
            "(Benzin,CNG,LPG)",
            "(Benzin,CNG,Etanol)",
            '(Benzin,"Etanol 85%",LPG)',
            "(Benzin,LNG)",
            "(Etanol,LPG)",
            "(CNG,Nafta)",
            "(LNG,Nafta)",
            "(LPG,Nafta)",
            "Vodík",
            "CNG",
            "BIO Metan",
            "(Benzin,CNG)",
            "(Benzin,Etanol,LPG)",
            "LNG",
        ]
    ].sum(axis=1)
    ostatni = df.drop(
        columns=[
            "year",
            "Benzin",
            "Nafta",
            "BIO Nafta",
            "Elektropohon",
            "(Elektropohon,Nafta)",
            "(Benzin,Elektropohon,LPG)",
            "(Benzin,Elektropohon)",
            "LPG",
            "(Benzin,LPG)",
            "(Benzin,CNG,LPG)",
            "(Benzin,CNG,Etanol)",
            '(Benzin,"Etanol 85%",LPG)',
            "(Benzin,LNG)",
            "(Etanol,LPG)",
            "(CNG,Nafta)",
            "(LNG,Nafta)",
            "(LPG,Nafta)",
            "Vodík",
            "CNG",
            "BIO Metan",
            "(Benzin,CNG)",
            "(Benzin,Etanol,LPG)",
            "LNG",
        ]
    ).sum(axis=1)

    # Assemble table.
    df = pd.concat(
        [
            year,
            benzin,
            nafta,
            elektro,
            plyn,
            ostatni,
        ],
        axis=1,
    ).set_axis(
        ["year", "benzin", "nafta", "elektrifikovane", "plyn", "ostatni"], axis=1
    )

    db.write("vehicles_changes_in_time_drive_type", df)


def electric(df: pd.DataFrame, db: Connection):
    year = df["year"]
    elektropohon = df["Elektropohon"]
    nafta_hybrid = df["(Elektropohon,Nafta)"]
    benzin_hybrid = df[["(Benzin,Elektropohon,LPG)", "(Benzin,Elektropohon)"]].sum(
        axis=1
    )

    # Assemble table.
    df = pd.concat(
        [
            year,
            elektropohon,
            nafta_hybrid,
            benzin_hybrid,
        ],
        axis=1,
    ).set_axis(["year", "elektropohon", "nafta_hybrid", "benzin_hybrid"], axis=1)

    db.write("vehicles_changes_in_time_electric_drive_type", df)
