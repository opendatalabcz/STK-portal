import pandas as pd


def filter_duplicates(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    return df.drop_duplicates(subset=["vin"], keep="first")
