import numpy as np
import pandas as pd
from sqlalchemy import text

from common.db import Connection
from ingestion.inspections.main import get_last_record_date


TABLE = "stations_defect_counts"


def stations_defect_counts(db: Connection):
    last_record = get_last_record_date(db)
    # 2018 has no defects listed.
    years = range(2019, last_record.year + 1)
    table = {
        "year": [],
        "defect_code": [],
        "defect_description": [],
        "count": [],
    }

    # Load defect descriptions.
    records = db.conn.execute(text(f"""SELECT code, description FROM defects""")).all()
    records = np.array(records)
    defect_table = pd.DataFrame(
        {
            "code": records[:, 0].flatten(),
            "description": records[:, 1].flatten(),
        }
    )

    # Load defect counts.
    for year in years:
        records = db.conn.execute(
            text(
                f"""SELECT defects
FROM inspections 
WHERE date_part('year', date) = {year}"""
            )
        ).all()

        records = np.array(records)[:, 0]

        defect_counts = {}

        for record in records:
            if record == None:
                continue

            defects = str(record).split(",")

            for defect in defects:
                if defect in defect_counts.keys():
                    defect_counts[defect] += 1
                else:
                    defect_counts[defect] = 1

        for code in defect_counts.keys():

            descriptions = defect_table[defect_table["code"] == code]["description"]
            if descriptions.size == 0:
                description = np.nan
            else:
                description = descriptions.iloc[0]

            table["year"].append(year)
            table["defect_code"].append(code)
            table["defect_description"].append(description)
            table["count"].append(defect_counts[code])

    df = pd.DataFrame(table)

    db.write(TABLE, df)
