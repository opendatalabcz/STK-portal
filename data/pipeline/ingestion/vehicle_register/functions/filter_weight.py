import pandas as pd
import numpy as np


def filter_weight(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    for col in ['operating_weight',
                'permissible_weight',
                'permissible_weight_braked_trailer',
                'permissible_weight_unbraked_trailer']:
        df[col] = df[col].mask(df[col] <= 0)
        df[col] = df[col].replace(np.inf, np.nan)
        df[col] = df[col].mask(df[col] > 50000)

    df['operating_weight'] = df['operating_weight'].mask(
        ((df['operating_weight'] > 3500) & (df['primary_type'] == 'OSOBNÍ AUTOMOBIL')))    
    df['permissible_weight'] = df['permissible_weight'].mask(
        ((df['permissible_weight'] > 3500) & (df['primary_type'] == 'OSOBNÍ AUTOMOBIL')))

    df['operating_weight'] = df['operating_weight'].mask(
        ((df['operating_weight'] > 20000) & (df['primary_type'] == 'NÁKLADNÍ AUTOMOBIL')))    
    df['permissible_weight'] = df['permissible_weight'].mask(
        ((df['permissible_weight'] > 50000) & (df['primary_type'] == 'NÁKLADNÍ AUTOMOBIL')))

    df['operating_weight'] = df['operating_weight'].mask(
        ((df['operating_weight'] > 2000) & (df['primary_type'] == 'MOTOCYKL')))    
    df['permissible_weight'] = df['permissible_weight'].mask(
        ((df['permissible_weight'] > 2000) & (df['primary_type'] == 'MOTOCYKL')))

    return df
