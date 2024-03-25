from common.db import Connection
from sqlalchemy import text


def stations_repeated_inspections_on_different_station(db: Connection):
    # Counts by station
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.stations_repeated_inspections_on_different_station_histogram;
DROP MATERIALIZED VIEW IF EXISTS public.stations_repeated_inspections_on_different_station_list;
DROP MATERIALIZED VIEW IF EXISTS public.stations_repeated_inspections_on_different_station;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_repeated_inspections_on_different_station
TABLESPACE pg_default
AS
 SELECT i.station_id,
    count(*) AS count
   FROM inspections i
  WHERE i.result = '0'::text AND i.inspection_type = 'repeated'::text AND (EXISTS ( SELECT j.vin
           FROM inspections j
          WHERE j.vin = i.vin AND j.result <> '0'::text AND i.station_id <> j.station_id AND (i.date - j.date) < 60))
  GROUP BY i.station_id
  ORDER BY (count(*)) DESC
WITH DATA;

ALTER TABLE IF EXISTS public.stations_repeated_inspections_on_different_station
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.stations_repeated_inspections_on_different_station
    IS 'Počet prohlídek na každé stanici, které byly opakované s úspěšným výsledkem, přičemž každé takové kontrole předcházela neúspěšná kontrola na jiné stanici.';
    
GRANT ALL ON TABLE public.stations_repeated_inspections_on_different_station TO postgres;
GRANT SELECT ON TABLE public.stations_repeated_inspections_on_different_station TO web_anon;"""
        )
    ).all()

    # Inspection list
    db.conn.execute(
        text(
            """CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_repeated_inspections_on_different_station_list
TABLESPACE pg_default
AS
 SELECT i.id, i.vin, i.date, i.station_id
   FROM inspections i
  WHERE i.result = '0'::text AND i.inspection_type = 'repeated'::text AND (EXISTS ( SELECT j.vin
           FROM inspections j
          WHERE j.vin = i.vin AND j.result <> '0'::text AND i.station_id <> j.station_id AND (i.date - j.date) < 60))
WITH DATA;

ALTER TABLE IF EXISTS public.stations_repeated_inspections_on_different_station_list
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.stations_repeated_inspections_on_different_station_list
    IS 'Prohlídky na každé stanici, které byly opakované s úspěšným výsledkem, přičemž každé takové kontrole předcházela neúspěšná kontrola na jiné stanici.';
    
GRANT ALL ON TABLE public.stations_repeated_inspections_on_different_station_list TO postgres;
GRANT SELECT ON TABLE public.stations_repeated_inspections_on_different_station_list TO web_anon;"""
        )
    ).all()

    # Histogram
    db.conn.execute(
        text(
            """CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_repeated_inspections_on_different_station_histogram
TABLESPACE pg_default
AS
 SELECT trunc((stations_repeated_inspections_on_different_station.count / 100)::double precision) AS hundreds,
    count(*) AS count
   FROM stations_repeated_inspections_on_different_station
  GROUP BY (trunc((stations_repeated_inspections_on_different_station.count / 100)::double precision))
  ORDER BY (trunc((stations_repeated_inspections_on_different_station.count / 100)::double precision))
WITH DATA;

ALTER TABLE IF EXISTS public.stations_repeated_inspections_on_different_station_histogram
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.stations_repeated_inspections_on_different_station_histogram
    IS 'Histogram po stovkách pro tabulku ''stations_repeated_inspections_on_different_station''';

GRANT ALL ON TABLE public.stations_repeated_inspections_on_different_station_histogram TO postgres;
GRANT SELECT ON TABLE public.stations_repeated_inspections_on_different_station_histogram TO web_anon;"""
        )
    ).all()
