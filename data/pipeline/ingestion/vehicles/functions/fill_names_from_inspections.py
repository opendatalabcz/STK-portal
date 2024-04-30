import numpy as np
import pandas as pd
from sqlalchemy import Connection, text


def fill_names_from_inspections(df: pd.DataFrame, conn: Connection, **kwargs):
    """Finds vehicle make and model names in the inspection dataset and
    uses that to"""

    makes = []
    models = []

    added_makes = 0
    added_models = 0

    for index, row in df.iterrows():
        vin = row["vin"]

        if pd.isna(row["make"]) or pd.isna(row["model_primary"]):
            # Attempt to find info for the missing data
            records = conn.execute(
                text(
                    f"""SELECT make, model_primary
                        FROM inspections WHERE vin = '{vin}'"""
                )
            ).all()

            if len(records) >= 1:
                # Take last inspection.
                make = records[-1][0]
                model_primary = records[-1][1]

                if pd.isna(row["make"]) and make != None:
                    makes.append(make)
                    added_makes += 1
                else:
                    makes.append(row["make"])

                if pd.isna(row["model_primary"]) and model_primary != None:
                    models.append(model_primary)
                    added_models += 1
                else:
                    models.append(row["model_primary"])
            else:
                makes.append(row["make"])
                models.append(row["model_primary"])
        else:
            makes.append(row["make"])
            models.append(row["model_primary"])

    df["make"] = np.array(makes)
    df["model_primary"] = np.array(models)

    # print(added_makes)
    # print(added_models)

    return df
