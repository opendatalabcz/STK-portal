from common.db import Connection
from sqlalchemy import text


def stations_average_inspection_frequency(db: Connection):
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.stations_average_inspection_frequency;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_average_inspection_frequency
TABLESPACE pg_default
AS
 SELECT x.station_id,
    x.week,
    x.day,
    avg(x.inspection_count) AS avg_inspection_count
   FROM ( SELECT inspections.station_id,
            date_part('year'::text, inspections.date) AS year,
            date_part('week'::text, inspections.date) AS week,
            EXTRACT(dow FROM inspections.date) AS day,
            count(*) AS inspection_count
           FROM inspections
          GROUP BY inspections.station_id, (date_part('year'::text, inspections.date)), (date_part('week'::text, inspections.date)), (EXTRACT(dow FROM inspections.date))) x
  GROUP BY x.station_id, x.week, x.day
WITH DATA;

ALTER TABLE IF EXISTS public.stations_average_inspection_frequency
    OWNER TO postgres;

GRANT ALL ON TABLE public.stations_average_inspection_frequency TO postgres;
GRANT SELECT ON TABLE public.stations_average_inspection_frequency TO web_anon;
"""
        )
    )
    db.conn.commit()
