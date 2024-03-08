from common.db import Connection
import numpy as np
import pandas as pd
from sqlalchemy import text


TABLE = "stations_average_inspection_count_by_severity_by_nuts3"


def stations_average_inspection_count_by_severity_by_nuts3(db: Connection):
    records = db.conn.execute(
        text(
            f"""SELECT date_part('year', i.date) as year, s.nuts3, AVG(i.defects_a) AS avg_defects_a, AVG(i.defects_b) AS avg_defects_b, AVG(i.defects_c) AS avg_defects_b
FROM inspections i JOIN stations s ON i.station_id = s.id
WHERE date_part('year', i.date) > 2018
GROUP BY year, s.nuts3
ORDER BY year ASC, s.nuts3 ASC"""
        )
    ).all()
    records = np.array(records)

    df = pd.DataFrame(
        {
            "year": records[:, 0].flatten(),
            "nuts3": records[:, 1].flatten(),
            "avg_defects_a": records[:, 2].flatten(),
            "avg_defects_b": records[:, 3].flatten(),
            "avg_defects_c": records[:, 4].flatten(),
        }
    )

    db.write(TABLE, df)
