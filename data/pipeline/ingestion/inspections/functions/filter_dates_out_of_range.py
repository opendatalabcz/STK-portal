import pandas as pd
import datetime


def filter_dates_out_of_range(
    df: pd.DataFrame, date: datetime.date, **kwargs
) -> pd.DataFrame:
    # Remove inspections which have a date outside of this month.
    start = pd.to_datetime(date.replace(day=1))
    if date.month < 12:
        end = pd.to_datetime(datetime.date(year=date.year, month=date.month + 1, day=1))
    else:
        end = pd.to_datetime(datetime.date(year=date.year + 1, month=1, day=1))

    # Remove inspections which have their first registration date prior to 1900
    # as those are clearly incorrect.
    df["first_registration"] = df["first_registration"].mask(
        df["first_registration"] < "1901-01-01"
    )

    return df[(df["date"] >= start) & (df["date"] < end)]
