import pandas as pd
import datetime


def filter_incomplete(df: pd.DataFrame, date: datetime.date = None, **kwargs) -> pd.DataFrame:
    # For 2018, do not drop rows with missing defects (they are all missing)
    if date.year == 2018:
        return df.dropna(how='any', subset=[
            'station_id',
            'date',
            'vin',
            'inspection_type',
            'result',
            'mileage',
            # not 'defects',
            'make',
            'motor_type',
            'vehicle_type',
            'model_primary',
            'vehicle_class',
            'first_registration_date',
        ])
    else:
        return df.dropna(how='any')