import pandas as pd


def drop_extra_columns(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    """Remove redundant cols which are not in the schema
    and will be taken from the vehicle registry.

    These columns were parsed only because they were needed in some steps
    of the pipeline."""

    return df.drop(
        [
            "vehicle_type",
            # 'first_registration',
        ],
        axis=1,
    )
