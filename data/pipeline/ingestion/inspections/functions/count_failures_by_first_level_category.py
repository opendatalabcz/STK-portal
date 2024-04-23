import pandas as pd
import datetime


def count_failures_by_first_level_category(
    df: pd.DataFrame, date: datetime.date, **kwargs
) -> pd.DataFrame:
    """ "Add counts of failures by first-level category based on the contents of `defects`"""

    # Skip 2018, as defects are not specified there
    if date.year == 2018:
        for col in [
            "defects_0",
            "defects_1",
            "defects_2",
            "defects_3",
            "defects_4",
            "defects_5",
            "defects_6",
            "defects_7",
            "defects_8",
            "defects_9",
        ]:
            df[col] = 0

        return df

    def map_failures(row):
        failure_codes = str(row["defects"]).split(",")
        if len(failure_codes) == 0:
            return (0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
        else:
            fs = [0 for i in range(10)]
            for failure_code in failure_codes:
                fln = -1
                try:
                    fln = int(failure_code.split(".")[0])
                except:
                    pass
                if fln >= 0 and fln <= 9:
                    fs[fln] = fs[fln] + 1
            return (
                fs[0],
                fs[1],
                fs[2],
                fs[3],
                fs[4],
                fs[5],
                fs[6],
                fs[7],
                fs[8],
                fs[9],
            )

    df[
        [
            "defects_0",
            "defects_1",
            "defects_2",
            "defects_3",
            "defects_4",
            "defects_5",
            "defects_6",
            "defects_7",
            "defects_8",
            "defects_9",
        ]
    ] = df.apply(map_failures, axis=1, result_type="expand")
    return df
