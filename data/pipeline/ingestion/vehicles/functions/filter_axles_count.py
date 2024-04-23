import pandas as pd
import numpy as np


def filter_axles_count(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    df["axles_count"] = df["axles_count"].mask(df["axles_count"] <= 0)
    df["axles_count"] = df["axles_count"].replace(np.inf, np.nan)
    df["axles_count"] = df["axles_count"].mask(df["axles_count"] > 20)

    return df
