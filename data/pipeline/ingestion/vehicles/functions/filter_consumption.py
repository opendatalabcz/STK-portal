import pandas as pd
import numpy as np


def filter_consumption(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    for col in ['average_consumption',
                'city_consumption',
                'out_of_city_consumption']:
        df[col] = df[col].mask(df[col] <= 0)
        df[col] = df[col].replace(np.inf, np.nan)
        df[col] = df[col].mask(df[col] > 100)

    return df
