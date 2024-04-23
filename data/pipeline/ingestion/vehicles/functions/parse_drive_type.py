import pandas as pd
import numpy as np


def parse_drive_type(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    options = [
        "BA SMĚS",
        "BIO Metan",
        "BIO Nafta",
        "CNG",
        "Benzin",
        "Elektropohon",
        "Etanol",
        "Etanol 85%",
        "Etanol 95%",
        "LNG",
        "LPG",
        "Nafta",
        "Vodík",
    ]

    def process(x):
        strx = str(x)

        if strx == "" or strx == "nan":
            return np.nan

        parts = strx.split("+")
        parts = [part.strip() for part in parts]

        if "Benzín" in parts:
            parts.remove("Benzín")
            parts.append("Benzin")

        parts.sort()

        return tuple(parts)

    # Why doesn't `apply` work?
    df["drive_type"] = [process(x) for x in df["drive_type"].to_list()]
    df["drive_type"] = df["drive_type"].astype("category")

    return df
