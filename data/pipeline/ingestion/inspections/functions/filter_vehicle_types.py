import pandas as pd


types_to_retain = [
    'OSOBNÍ AUTOMOBIL',
    'NÁKLADNÍ AUTOMOBIL',
    'MOTOCYKL',
]


def filter_vehicle_types(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    return df[df['vehicle_type'].isin(types_to_retain)]