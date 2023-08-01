import pandas as pd
from typing import Collection

def filter_unknown_stations(df: pd.DataFrame, station_ids: Collection[str], **kwargs) -> pd.DataFrame:
    return df[df['station_id'].isin(station_ids)]