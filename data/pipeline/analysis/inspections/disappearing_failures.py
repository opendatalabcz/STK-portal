from common.db import Connection
from sqlalchemy import text


def stations_dissapearing_failures(db: Connection):
    # Counts by station
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.stations_dissapearing_failures_by_station_histogram;
DROP MATERIALIZED VIEW IF EXISTS public.stations_dissapearing_failures_inspection_list;
DROP MATERIALIZED VIEW IF EXISTS public.stations_dissapearing_failures_by_station;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_dissapearing_failures_by_station
TABLESPACE pg_default
AS
  SELECT i.station_id, count(*) as count
  FROM inspections i
    JOIN inspections j
    ON i.vin = j.vin
      AND i.date - j.date > 670
      AND i.date - j.date < 790
  WHERE i.inspection_type = 'regular'
    AND j.inspection_type = 'regular'
    AND j.defects_a - i.defects_a >= 5
  GROUP BY i.station_id
  ORDER BY count DESC
WITH DATA;

ALTER TABLE IF EXISTS public.stations_dissapearing_failures_by_station
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.stations_dissapearing_failures_by_station
    IS 'Počet prohlídek na každé stanici, kde se výrazně snížil počet lehkých závad na vozidle v porovnání s předchozí pravidelnou kontrolou.';
    
GRANT ALL ON TABLE public.stations_dissapearing_failures_by_station TO postgres;
GRANT SELECT ON TABLE public.stations_dissapearing_failures_by_station TO web_anon;"""
        )
    ).all()

    # Inspection list
    db.conn.execute(
        text(
            """CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_dissapearing_failures_inspection_list
TABLESPACE pg_default
AS
  SELECT i.id, i.station_id, i.vin, i.date
  FROM inspections i
    JOIN inspections j
    ON i.vin = j.vin
      AND i.date - j.date > 670
      AND i.date - j.date < 790
  WHERE i.inspection_type = 'regular'
    AND j.inspection_type = 'regular'
    AND j.defects_a - i.defects_a >= 5
WITH DATA;

ALTER TABLE IF EXISTS public.stations_dissapearing_failures_inspection_list
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.stations_dissapearing_failures_inspection_list
    IS 'Kontroly, kde se výrazně snížil počet lehkých závad na vozidle v porovnání s předchozí pravidelnou kontrolou.';
    
GRANT ALL ON TABLE public.stations_dissapearing_failures_inspection_list TO postgres;
GRANT SELECT ON TABLE public.stations_dissapearing_failures_inspection_list TO web_anon;"""
        )
    ).all()

    # Histogram
    db.conn.execute(
        text(
            """CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_dissapearing_failures_by_station_histogram
TABLESPACE pg_default
AS
 SELECT trunc((stations_dissapearing_failures_by_station.count / 10)::double precision) AS hundreds,
    count(*) AS count
   FROM stations_dissapearing_failures_by_station
  GROUP BY (trunc((stations_dissapearing_failures_by_station.count / 10)::double precision))
  ORDER BY (trunc((stations_dissapearing_failures_by_station.count / 10)::double precision))
WITH DATA;

ALTER TABLE IF EXISTS public.stations_dissapearing_failures_by_station_histogram
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.stations_dissapearing_failures_by_station_histogram
    IS 'Histogram po desítkách pro tabulku ''stations_dissapearing_failures_by_station''';

GRANT ALL ON TABLE public.stations_dissapearing_failures_by_station_histogram TO postgres;
GRANT SELECT ON TABLE public.stations_dissapearing_failures_by_station_histogram TO web_anon;"""
        )
    ).all()
