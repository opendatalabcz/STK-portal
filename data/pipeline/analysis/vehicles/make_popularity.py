from sqlalchemy import text
from common.db import Connection

from ingestion.inspections.main import get_last_record_date

import numpy as np
import pandas as pd


TABLE = "vehicles_make_popularity"


def vehicles_make_popularity(db: Connection):
    # Init result table.
    table = {}
    last_record = get_last_record_date(db)
    table["year"] = range(1990, last_record.year + 1)

    records = db.conn.execute(
        text(
            f"""SELECT date_part('year', v.first_registration) as year, make, count(1) as count
FROM vehicles v
WHERE make IS NOT NULL AND v.first_registration IS NOT NULL
GROUP BY year, make
ORDER BY year ASC, count DESC"""
        )
    ).all()
    records = np.array(records)

    df = pd.DataFrame(
        {
            # Parse float from string, then truncate to int.
            "year": records[:, 0].astype(float).astype(np.int16),
            "make": records[:, 1],
            "count": records[:, 2].astype(float).astype(np.int64),
        }
    )

    db.write(TABLE, df)
