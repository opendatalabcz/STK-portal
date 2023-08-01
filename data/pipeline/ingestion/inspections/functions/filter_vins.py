import pandas as pd


def filter_vins(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    return df[df['vin'].str.len() == 17]