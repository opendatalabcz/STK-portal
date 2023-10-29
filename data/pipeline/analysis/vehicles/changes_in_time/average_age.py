from sqlalchemy import Connection, text

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = 'vehicles_changes_in_time_average_age'


def vehicles_changes_in_time_average_age(conn: Connection):
    # Load data from DB.
    means = []

    # Skip 2018 due to uncomparable data.
    last_record = get_last_record_date(conn)
    
    # Get an average for each year.
    years = range(2019, last_record.year + 1)
    for year in years:
        # Load all unique vehicles inspected that year.
        records = conn.execute(text(f'''SELECT v.first_registration
FROM inspections i
	JOIN vehicle_register v ON i.vin = v.vin
WHERE v.primary_type = 'OSOBNÍ AUTOMOBIL'
    AND i.date >= \'{year}-01-01\' AND i.date < \'{year + 1}-01-01\'
	AND i.inspection_type IN ('regular', 'evidence')''')).all()
        registration_dates = np.array(records)[:, 0].flatten()

        # Get vehicle ages as floored year counts.
        ages = []
        for x in registration_dates:
            if x is not None:
                ages.append(year - x.year)
    
        ages = np.array(ages)
        means.append(ages.mean())
    
    df = pd.DataFrame({
        "year": years,
        "mean": means,
    })

    df.to_sql(TABLE, conn, if_exists="replace", index=False)
    conn.commit()
