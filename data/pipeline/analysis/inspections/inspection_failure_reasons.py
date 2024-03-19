import numpy as np
import pandas as pd
from sqlalchemy import text

from common.db import Connection
from ingestion.inspections.main import get_last_record_date


TABLE = "stations_inspection_failure_reasons"


def stations_inspection_failure_reasons(db: Connection):
    last_record = get_last_record_date(db)
    # 2018 has no defects listed.
    years = range(2019, last_record.year + 1)
    table = {
        "year": [],
        "make": [],
        "top1_defect_code": [],
        "top1_defect_description": [],
        "top1_defect_count": [],
        "top2_defect_code": [],
        "top2_defect_description": [],
        "top2_defect_count": [],
        "top3_defect_code": [],
        "top3_defect_description": [],
        "top3_defect_count": [],
        "total_inspections": [],
    }

    # Load defect descriptions.
    records = db.conn.execute(
        text(f"""SELECT code, description, type FROM defects""")
    ).all()
    records = np.array(records)
    defect_table = pd.DataFrame(
        {
            "code": records[:, 0].flatten(),
            "description": records[:, 1].flatten(),
            "type": records[:, 2].flatten(),
        }
    )

    # Load defect counts.
    for year in years:
        records = db.conn.execute(
            text(
                f"""SELECT make, defects
FROM inspections
WHERE date_part('year', date) = {year}
	AND result <> '0'
	AND make IN (
		SELECT make
		FROM inspections
		WHERE date_part('year', date) = {year}
		GROUP BY make
		ORDER BY count(1) DESC
		LIMIT 10
	)"""
            )
        ).all()

        records = np.array(records)
        records = pd.DataFrame(
            {
                "make": records[:, 0].flatten(),
                "defects": records[:, 1].flatten(),
            }
        )
        makes = records["make"].unique()

        defect_counts = {make: {} for make in makes}
        inspection_counts = {make: 0 for make in makes}

        # Count each defect frequency and total inspection count for each make.
        for _, record in records.iterrows():

            def is_defect_severe(code: str):
                types = defect_table[defect_table["code"] == code]["type"]
                if types.size == 0:
                    defect_type = None
                else:
                    defect_type = types.iloc[0]
                return defect_type == "B" or defect_type == "C"

            make = record["make"]

            inspection_counts[make] += 1

            if pd.isna(record["defects"]):
                continue

            defects = str(record["defects"]).split(",")

            for defect in defects:
                if not is_defect_severe(defect):
                    continue

                if defect in defect_counts[make].keys():
                    defect_counts[make][defect] += 1
                else:
                    defect_counts[make][defect] = 1

        # Assemble rows of the result table for this year.
        for make in makes:
            table["year"].append(year)
            table["make"].append(make)
            table["total_inspections"].append(inspection_counts[make])

            # Get top 3 defects by count
            top_defects = sorted(
                defect_counts[make].items(), key=lambda x: x[1], reverse=True
            )[:3]

            def get_defect_description(code: str):
                descriptions = defect_table[defect_table["code"] == code]["description"]
                if descriptions.size == 0:
                    description = np.nan
                else:
                    description = descriptions.iloc[0]
                return description

            table["top1_defect_code"].append(top_defects[0][0])
            table["top1_defect_description"].append(
                get_defect_description(top_defects[0][0])
            )
            table["top1_defect_count"].append(top_defects[0][1])

            table["top2_defect_code"].append(top_defects[1][0])
            table["top2_defect_description"].append(
                get_defect_description(top_defects[1][0])
            )
            table["top2_defect_count"].append(top_defects[1][1])

            table["top3_defect_code"].append(top_defects[2][0])
            table["top3_defect_description"].append(
                get_defect_description(top_defects[2][0])
            )
            table["top3_defect_count"].append(top_defects[2][1])

    df = pd.DataFrame(table)

    db.write(TABLE, df)
