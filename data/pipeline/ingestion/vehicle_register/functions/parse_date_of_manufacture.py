import pandas as pd
import numpy as np
from datetime import datetime


def parse_date_of_manufacture(df: pd.DataFrame, min_date: int, **kwargs) -> pd.DataFrame:
    this_year = datetime.now().year

    def process(x):
        try:
            value = int(x)
            if value > min_date and value <= this_year:
                return value
            else:
                return np.nan
        except:
            return np.nan

    df['manufacture_year'] = df['manufacture_year'].apply(process)
    return df
