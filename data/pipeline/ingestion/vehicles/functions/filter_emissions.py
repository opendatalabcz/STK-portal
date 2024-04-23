import pandas as pd
import numpy as np


def filter_emissions(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    for col in ["emissions", "city_emissions", "out_of_city_emissions"]:
        df[col] = df[col].mask(df[col] <= 0)
        df[col] = df[col].replace(np.inf, np.nan)
        df[col] = df[col].mask(df[col] > 500)

    return df
