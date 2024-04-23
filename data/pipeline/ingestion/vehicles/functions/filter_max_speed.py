import pandas as pd
import numpy as np


def filter_max_speed(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    df["max_speed"] = df["max_speed"].mask(df["max_speed"] <= 0)
    df["max_speed"] = df["max_speed"].replace(np.inf, np.nan)
    df["max_speed"] = df["max_speed"].mask(df["max_speed"] > 500)

    return df
