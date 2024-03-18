from common.db import Connection
from sqlalchemy import text


def stations_top_models_by_station(db: Connection):
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.stations_top_models_by_station;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_top_models_by_station
TABLESPACE pg_default
AS
    SELECT station_id, date_part('year', date) as year, make, model_primary, count(*) as count
    FROM inspections
    GROUP BY station_id, year, make, model_primary
WITH DATA;

ALTER TABLE IF EXISTS public.stations_top_models_by_station
    OWNER TO postgres;

GRANT ALL ON TABLE public.stations_top_models_by_station TO postgres;
GRANT SELECT ON TABLE public.stations_top_models_by_station TO web_anon;
"""
        )
    ).all()
