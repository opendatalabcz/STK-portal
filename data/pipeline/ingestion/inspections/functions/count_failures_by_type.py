import pandas as pd
import datetime


def count_failures_by_type(
    df: pd.DataFrame, date: datetime.date, defects: pd.DataFrame, **kwargs
) -> pd.DataFrame:
    """ "Add count of failures by severity based on the contents of `defects`"""

    # Skip 2018, as defects are not specified there
    if date.year == 2018:
        df["defects_a"] = 0
        df["defects_b"] = 0
        df["defects_c"] = 0

        return df

    def map_failures(row):
        failure_codes = str(row["defects"]).split(",")
        if len(failure_codes) == 0:
            return (0, 0, 0)
        else:
            a = 0
            b = 0
            c = 0
            for failure_code in failure_codes:
                type = None
                try:
                    type = defects["type"].loc[failure_code]
                except:
                    pass
                if type == "A":
                    a = a + 1
                if type == "B":
                    b = b + 1
                if type == "C":
                    c = c + 1
            return (a, b, c)

    df[["defects_a", "defects_b", "defects_c"]] = df.apply(
        map_failures, axis=1, result_type="expand"
    )
    return df
