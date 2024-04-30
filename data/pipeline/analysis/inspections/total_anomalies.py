from common.db import Connection
from sqlalchemy import text


def stations_total_anomalies(db: Connection):
    # Counts by station
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.stations_total_anomalies_by_station;
DROP MATERIALIZED VIEW IF EXISTS public.stations_total_anomalies_by_station_histogram;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_total_anomalies_by_station
TABLESPACE pg_default
AS
 SELECT sdf.station_id,
    sdf.count + sri.count AS anomalous,
    ic.count AS total,
    (sdf.count + sri.count)::double precision / ic.count::double precision AS ratio
   FROM stations_dissapearing_failures_by_station sdf
     JOIN stations_repeated_inspections_on_different_station sri ON sdf.station_id = sri.station_id
     JOIN ( SELECT inspections.station_id,
            count(*) AS count
           FROM inspections
          GROUP BY inspections.station_id) ic ON sdf.station_id = ic.station_id
WITH DATA;

ALTER TABLE IF EXISTS public.stations_total_anomalies_by_station
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.stations_total_anomalies_by_station
    IS 'Celkový počet anomálních prohlídek a podíl anomálních vůči všem.';

GRANT ALL ON TABLE public.stations_total_anomalies_by_station TO postgres;
GRANT SELECT ON TABLE public.stations_total_anomalies_by_station TO web_anon;"""
        )
    )

    # Histogram
    db.conn.execute(
        text(
            """CREATE MATERIALIZED VIEW IF NOT EXISTS public.stations_total_anomalies_by_station_histogram
TABLESPACE pg_default
AS
 SELECT trunc((stations_total_anomalies_by_station.ratio * 1000)::double precision) AS thousandths,
    count(*) AS count
   FROM stations_total_anomalies_by_station
  GROUP BY (trunc((stations_total_anomalies_by_station.ratio * 1000)::double precision))
  ORDER BY (trunc((stations_total_anomalies_by_station.ratio * 1000)::double precision))
WITH DATA;

ALTER TABLE IF EXISTS public.stations_total_anomalies_by_station_histogram
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.stations_total_anomalies_by_station_histogram
    IS 'Histogram po tisícinách (tj. desetinách procenta) pro tabulku ''stations_total_anomalies_by_station''';

GRANT ALL ON TABLE public.stations_total_anomalies_by_station_histogram TO postgres;
GRANT SELECT ON TABLE public.stations_total_anomalies_by_station_histogram TO web_anon;"""
        )
    )
    db.conn.commit()
