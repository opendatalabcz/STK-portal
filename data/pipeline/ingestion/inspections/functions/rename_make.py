import pandas as pd


def rename_make(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    df["make"] = df.apply(
        lambda row: "VW" if row["make"] == "VOLKSWAGEN" else row["make"],
        axis=1,
        result_type=None,
    )

    return df
