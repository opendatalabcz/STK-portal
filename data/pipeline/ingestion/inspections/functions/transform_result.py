import pandas as pd


def transform_result(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    # Should be already inferred, do this just to be sure.
    df["result"] = df["result"].astype("category")

    df["result"] = df["result"].cat.rename_categories(
        {
            "způsobilé": "0",
            "částečně způsobilé": "1",
            "nezpůsobilé": "2",
        }
    )

    return df
