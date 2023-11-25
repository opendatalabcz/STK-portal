import pandas as pd
import numpy as np


def filter_motor_volume(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    df['motor_volume'] = df['motor_volume'].mask(df['motor_volume'] <= 0)
    
    df['motor_volume'] = df['motor_volume'].mask(df['motor_volume'] > 50000)

    df['motor_volume'] = df['motor_volume'].mask(
        ((df['motor_volume'] > 3500)
            & (df['primary_type'] == 'OSOBNÍ AUTOMOBIL'))
         | ((df['motor_volume'] > 20000)
            & (df['primary_type'] == 'NÁKLADNÍ AUTOMOBIL')))
    
    df['motor_volume'] = df['motor_volume'].replace(np.inf, np.nan)
   
    return df