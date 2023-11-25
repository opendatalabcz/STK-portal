import pandas as pd
import datetime


def filter_incomplete(
    df: pd.DataFrame,
    date: datetime.date,
    **kwargs,
) -> pd.DataFrame:
    # Drop inspections with missing data, excl. defects (those are just vehicles
    # in perfect condition).
    return df.dropna(
        how="any",
        subset=[
            "station_id",
            "date",
            "vin",
            "inspection_type",
            "result",
            "mileage",
            # not 'defects',
            "first_registration",
        ],
    )
