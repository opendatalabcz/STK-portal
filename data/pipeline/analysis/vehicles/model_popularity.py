from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = "vehicles_model_popularity"


def vehicles_model_popularity(db: Connection):
    # Init result table.
    table = {}
    last_record = get_last_record_date(db)
    table["year"] = range(1990, last_record.year + 1)

    records = db.conn.execute(
        text(
            f"""SELECT date_part('year', v.first_registration) as year, make, model_primary, count(1) as count
FROM vehicles v
WHERE make IS NOT NULL
    AND model_primary IS NOT NULL
    AND v.first_registration IS NOT NULL
GROUP BY year, make, model_primary
ORDER BY year ASC, count DESC"""
        )
    ).all()
    records = np.array(records)

    models = []
    for record in records:
        models.append(record[1] + " " + record[2])

    df = pd.DataFrame(
        {
            # Parse float from string, then truncate to int.
            "year": records[:, 0].astype(float).astype(np.int16),
            "model": np.array(models),
            "count": records[:, 3].astype(float).astype(np.int64),
        }
    )

    db.write(TABLE, df)
