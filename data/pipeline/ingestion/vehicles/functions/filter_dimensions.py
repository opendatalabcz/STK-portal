import pandas as pd
import numpy as np
from re import split


def filter_dimensions(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    # Only take the first dimension if there are multiple values.
    df['wheelbase_size'] = pd.to_numeric(df['wheelbase_size'].apply(
        lambda x: split(r'\D+', x.replace(' ', ''))[0]), errors='coerce')

    for col in ['vehicle_length', 'vehicle_width', 'vehicle_height', 'wheelbase_size']:
        df[col] = df[col].mask(df[col] <= 0)
        df[col] = df[col].replace(np.inf, np.nan)
        df[col] = df[col].mask(df[col] > 20000)

    return df
