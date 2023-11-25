import pandas as pd
import numpy as np

def process_missing(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    df = df.replace('---', np.NaN)
    df = df.replace('nan', np.NaN)
    return df.replace('', np.NaN)