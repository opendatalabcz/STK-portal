import pandas as pd
import numpy as np


def process_missing(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    df = df.replace("NEUVEDENO", np.NaN)
    df = df.replace("JINÉ", np.nan)
    df = df.replace("nan", np.nan)
    return df.replace("", np.NaN)
