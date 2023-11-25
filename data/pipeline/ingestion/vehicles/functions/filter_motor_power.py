import pandas as pd
import numpy as np


def filter_motor_power(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    df['motor_power'] = df['motor_power'].mask(df['motor_power'] <= 0)
    df['motor_power'] = df['motor_power'].mask(df['motor_power'] > 250)
    df['motor_power'] = df['motor_power'].replace(np.inf, np.nan)
    
    return df
