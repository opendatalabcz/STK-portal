import pandas as pd
import datetime


def filter_dates_out_of_range(df: pd.DataFrame, date: datetime.date, **kwargs) -> pd.DataFrame:
    start = pd.to_datetime(date.replace(day=1))
    if date.month < 12:
        end = pd.to_datetime(datetime.date(year=date.year, month=date.month + 1, day=1))
    else:
        end = pd.to_datetime(datetime.date(year=date.year + 1, month=1, day=1))

    return df[(df['date'] >= start) & (df['date'] < end)]
