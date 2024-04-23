from datetime import datetime
import pandas as pd
import numpy as np


def process_registration_dates(
    df: pd.DataFrame, min_date: int, **kwargs
) -> pd.DataFrame:
    df["first_registration"] = pd.to_datetime(
        df["first_registration"], format="%d.%m.%Y", exact=False, errors="coerce"
    )
    df["first_registration_cz"] = pd.to_datetime(
        df["first_registration_cz"], format="%d.%m.%Y", exact=False, errors="coerce"
    )

    min_timestamp = f"{min_date}-01-01"
    max_timestamp = datetime.now()

    df["first_registration"] = df["first_registration"].mask(
        (df["first_registration"] < min_timestamp)
        | (df["first_registration"] > max_timestamp)
    )

    df["first_registration_cz"] = df["first_registration_cz"].mask(
        (df["first_registration_cz"] < min_timestamp)
        | (df["first_registration_cz"] > max_timestamp)
    )

    return df
