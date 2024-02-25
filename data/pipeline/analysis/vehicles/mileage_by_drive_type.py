from sqlalchemy import text
from common.db import Connection

import numpy as np
import pandas as pd


TABLE = "vehicles_mileage_by_drive_type"


def vehicles_mileage_by_drive_type(db: Connection):
    # Load data from DB.
    records = db.conn.execute(
        text(
            f"""SELECT i.year, v.drive_type, SUM(i.mileage) AS mileage
FROM
	(
		SELECT DISTINCT ON (year, vin) date_part('year', date) as year, vin, mileage
	 	FROM inspections
	) AS i
	JOIN vehicles AS v
	ON i.vin = v.vin
WHERE v.drive_type IS NOT NULL
GROUP BY i.year, v.drive_type
ORDER BY i.year ASC, v.drive_type ASC"""
        )
    ).all()

    # Pivot table so it has years in rows and drive types in columns.

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

    # Group drive types in the same way as in changes_in_time/drive_type.
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

    # # Convert to relative numbers, because the sums of mileages say nothing.
    # df["total"] = df[["benzin", "nafta", "elektrifikovane", "plyn", "ostatni"]].sum(
    #     axis=1
    # )

    # df["benzin"] = df["benzin"] / df["total"]
    # df["nafta"] = df["nafta"] / df["total"]
    # df["elektrifikovane"] = df["elektrifikovane"] / df["total"]
    # df["plyn"] = df["plyn"] / df["total"]
    # df["ostatni"] = df["ostatni"] / df["total"]

    # df.drop(columns=["total"], inplace=True)

    db.write(TABLE, df)
