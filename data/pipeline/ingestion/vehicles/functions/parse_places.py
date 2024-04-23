import pandas as pd
import numpy as np


def parse_places(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    def process(x):
        total = 0
        try:
            return int(x)
        except:
            strx = str(x)
            if "/" in strx:
                strx = strx.split("/")[0]

            parts = strx.split("+")
            for part in parts:
                try:
                    total += int(part.strip().split(" ")[0].strip("*"))
                except:
                    pass
        if total > 0 and total <= 200:
            return total
        else:
            return np.nan

    df["places"] = df["places"].apply(process).astype(np.float16)
    df["places"] = df["places"].replace(np.inf, np.nan)  # process would not do this???

    return df
