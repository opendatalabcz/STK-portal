import pandas as pd


def add_vehicle_age(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    df["vehicle_age"] = df.apply(
        lambda row: (row["date"] - row["first_registration"]).days,
        axis=1,
        result_type=None,
    )

    return df
