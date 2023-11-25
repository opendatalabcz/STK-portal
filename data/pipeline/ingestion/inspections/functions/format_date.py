import pandas as pd
import datetime


def format_date_v1(df):
    df["date"] = pd.to_datetime(
        df["date"], format="%Y-%m-%d", exact=False, errors="coerce"
    )
    df["first_registration"] = pd.to_datetime(
        df["first_registration"], format="%Y-%m-%d", exact=False, errors="coerce"
    )
    return df


def format_date_v2(df):
    df["date"] = pd.to_datetime(
        df["date"], format="%m/%d/%Y", exact=True, errors="coerce"
    )
    df["first_registration"] = pd.to_datetime(
        df["first_registration"], format="%m/%d/%Y", exact=True, errors="coerce"
    )
    return df


def format_date_v3(df):
    df["date"] = pd.to_datetime(
        df["date"], format="%d.%m.%Y", exact=True, errors="coerce"
    )
    df["first_registration"] = pd.to_datetime(
        df["first_registration"], format="%d.%m.%Y", exact=True, errors="coerce"
    )
    return df


def format_date(df: pd.DataFrame, date: datetime.date, **kwargs) -> pd.DataFrame:
    # Convert to datetime based on file version
    if date.year == 2018 or (date.year == 2019 and date.month <= 3):
        df = format_date_v1(df)
    elif date.year == 2019 and date.month >= 4 and date.month <= 7:
        df = format_date_v2(df)
    else:
        df = format_date_v3(df)

    # Drop invalid rows
    df = df.dropna(
        how="any",
        subset=[
            "date",
        ],
    )  # 'first_registration'])

    return df
