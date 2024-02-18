import pandas as pd
import numpy as np


def group_models(df: pd.DataFrame, model_primary_frequencies, **kwargs) -> pd.DataFrame:
    df["model_primary"] = df["model_primary"].astype("str")

    # Strip trailing content in parentheses.
    df["model_primary"] = df["model_primary"].apply(lambda x: x.split("(")[0].strip())
    # Remove special characters and duplicate spaces
    df["model_primary"] = df["model_primary"].str.replace(r"[^\w\s]", "", regex=True)
    df["model_primary"] = df["model_primary"].str.replace("  ", " ")
    df["model_primary"] = df["model_primary"].str.replace("   ", " ")

    sws_uniq, sws_cnt, tws_uniq, tws_cnt = model_primary_frequencies

    # For each make, group two-word values with <25 occurences whose first-word-only instance has >50 occurences
    # and group similarly seldom appearing multiword (3+ words) values to often appearing two-word values.
    # When a multiword value is seldom, replace it with the first-word-only value when that has enough occurences.
    by_make = df.groupby("make")
    for make, mdf in by_make:
        # print(f'make: {make}')
        # Obtain counts of two-word values.
        twv = mdf[mdf["model_primary"].apply(lambda x: len(x.split(" "))) == 2][
            "model_primary"
        ].to_numpy()
        twv_uniq, twv_cnt = np.unique(twv, return_counts=True)

        # print(twv_uniq)

        for val, cnt in zip(twv_uniq, twv_cnt):
            if cnt < 25:
                # print(f'Found a candidate: {val}')
                # Find a corresponding single-word value.
                fwp = val.split(" ")[0]
                indices = np.where(sws_uniq == fwp)[0]
                # Check if the count of the single-word value is big enough.
                if indices.size > 0 and sws_cnt[indices[0]] > 50:
                    # Group to the single-word value
                    # print(f'Good 2w candidate: {val} ({cnt}) (group to "{sws_uniq[indices[0]]}" with {sws_cnt[indices[0]]} occrs)')
                    df.loc[
                        (by_make.as_index) & (df["model_primary"] == val),
                        "model_primary",
                    ] = fwp
                    continue

        # Obtain counts of two-word values.
        mwv = mdf[mdf["model_primary"].apply(lambda x: len(x.split(" "))) >= 3][
            "model_primary"
        ].to_numpy()
        mwv_uniq, mwv_cnt = np.unique(mwv, return_counts=True)

        # print(mwv_uniq)

        for val, cnt in zip(mwv_uniq, mwv_cnt):
            if cnt < 25:
                # print(f'Found a candidate: {val}')
                # Find a corresponding single-word value.
                twp = " ".join(val.split(" ")[0:2])
                indices = np.where(tws_uniq == twp)[0]
                # Check if the count of the single-word value is big enough.
                if indices.size > 0 and tws_cnt[indices[0]] > 50:
                    # Group to the single-word value
                    # print(f'Good mw candidate: {val} (group to "{tws_uniq[indices[0]]}" with {tws_cnt[indices[0]]} occrs)')
                    df.loc[
                        (by_make.as_index) & (df["model_primary"] == val),
                        "model_primary",
                    ] = twp
                    continue
                # Check if the first-word-only variant has enough occurences.
                else:
                    fwp = val.split(" ")[0]
                    indices = np.where(sws_uniq == fwp)[0]
                    # Check if the count of the single-word value is big enough.
                    if indices.size > 0 and sws_cnt[indices[0]] > 50:
                        # Group to the single-word value
                        # print(f'Good mw->1w candidate: {val} ({cnt}) (group to "{sws_uniq[indices[0]]}" with {sws_cnt[indices[0]]} occrs)')
                        df.loc[
                            (by_make.as_index) & (df["model_primary"] == val),
                            "model_primary",
                        ] = fwp
                        continue

    df["model_primary"] = df["model_primary"].astype("category")
    df["model_primary"] = df["model_primary"].mask(df["model_primary"] == "nan")

    return df
