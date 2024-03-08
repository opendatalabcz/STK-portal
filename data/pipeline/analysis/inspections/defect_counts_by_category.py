import numpy as np
import pandas as pd
from sqlalchemy import text

from common.db import Connection
from ingestion.inspections.main import get_last_record_date


TABLE = "stations_defect_counts_by_category"


def stations_defect_counts_by_category(db: Connection):
    last_record = get_last_record_date(db)
    # 2018 has no defects listed
    years = range(2019, last_record.year + 1)
    table = {
        "year": [],
        "defect_category": [],
        "count": [],
    }

    for year in years:
        records = db.conn.execute(
            text(
                f"""SELECT defects
FROM inspections 
WHERE date_part('year', date) = {year}"""
            )
        ).all()

        records = np.array(records)[:, 0]

        category_counts = {str(i): 0 for i in range(0, 10)}

        for record in records:
            if record == None:
                continue

            defects = str(record).split(",")

            for defect in defects:
                category = defect.split(".")[0]
                if category in category_counts.keys():
                    category_counts[category] += 1

        for category in category_counts.keys():
            table["year"].append(year)
            table["defect_category"].append(category)
            table["count"].append(category_counts[category])

    df = pd.DataFrame(table)

    db.write(TABLE, df)
