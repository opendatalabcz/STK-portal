from datetime import date
from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = "vehicles_average_age_by_drive_type"


def vehicles_average_age_by_drive_type(db: Connection):
    means = {
        "benzin": [],
        "nafta": [],
        "elektrifikovane": [],
        "plyn": [],
        "ostatni": [],
    }

    # Load data from DB.
    last_record = get_last_record_date(db)

    # Get an average for each year and drive type.
    years = range(2020, last_record.year + 1)
    for year in years:
        # Load all unique vehicles inspected that year.
        records = db.conn.execute(
            text(
                # f"""SELECT DISTINCT ON (v.vin) v.drive_type, v.first_registration
                # FROM inspections i
                # 	JOIN vehicles v ON i.vin = v.vin
                # WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
                #     AND i.date >= \'{year}-01-01\' AND i.date < \'{year + 1}-01-01\'
                # 	AND i.inspection_type IN ('regular', 'evidence')
                #     AND v.first_registration IS NOT NULL
                #     AND v.drive_type IS NOT NULL
                f"""
    SELECT v.drive_type, v.first_registration 
FROM vehicles v
	LEFT JOIN vehicles_estimated_end_of_life e ON v.vin = e.vin
WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
    AND (
			(v.operating_state = 'PROVOZOVANÉ' AND v.first_registration <= '{year}-12-31')
			OR
			(v.operating_state <> 'PROVOZOVANÉ' AND e.estimated_end_of_life >= '{year}-01-01')
		)
    AND v.first_registration IS NOT NULL
    AND v.drive_type IS NOT NULL"""
            )
        ).all()

        # Get vehicle ages as decimal year counts related to the last day
        # of the year (because some vehicles would have negative age if
        # we related it to the middle of the year).
        end_of_year = date(year=year, month=12, day=31)
        ages = {
            "benzin": [],
            "nafta": [],
            "elektrifikovane": [],
            "plyn": [],
            "ostatni": [],
        }
        for record in records:
            # Grouping is identical to the one used in drive type ratio analysis.
            # - pouze benzin
            # - pouze nafta nebo bio nafta
            # - obsahuje elektro
            # - obsahuje plyn (CNG, LPG, LNG) ale ne elektro
            # - ostatni
            if "Elektropohon" in record:
                drive_type_group = "elektrifikovane"
            elif (
                "LPG" in record
                or "CNG" in record
                or "LNG" in record
                or "Vodík" in record
                or "Metan" in record
            ):
                drive_type_group = "plyn"
            elif "Benzin" in record:
                drive_type_group = "benzin"
            elif "Nafta" in record:
                drive_type_group = "nafta"
            else:
                drive_type_group = "ostatni"

            ages[drive_type_group].append((end_of_year - record[1]).days / 365.25)

        for drive_type, ages in ages.items():
            means[drive_type].append(np.array(ages).mean())

    df = pd.DataFrame(
        {
            "year": years,
            "benzin": means["benzin"],
            "nafta": means["nafta"],
            "elektrifikovane": means["elektrifikovane"],
            "plyn": means["plyn"],
            "ostatni": means["ostatni"],
        }
    )

    db.write(TABLE, df)
