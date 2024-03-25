from common.db import Connection
from sqlalchemy import text


def stations_inspections_on_frequent_days(db: Connection):
    # Inspection list.
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.inspections_on_frequent_days_by_station_histogram;
DROP MATERIALIZED VIEW IF EXISTS public.inspections_on_frequent_days_by_station;
DROP MATERIALIZED VIEW IF EXISTS public.inspections_on_frequent_days;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.inspections_on_frequent_days
TABLESPACE pg_default
AS
 SELECT i.id,
    i.station_id,
    i.date,
    i.vin,
    daily_counts.daily_count,
    avgs.avg AS month_dow_avg,
    stddevs.stddev AS month_dow_stddev
   FROM inspections i
     JOIN ( SELECT inspections.station_id,
            inspections.date,
            count(*) AS daily_count
           FROM inspections
          GROUP BY inspections.station_id, inspections.date) daily_counts ON i.station_id = daily_counts.station_id AND i.date = daily_counts.date
     JOIN ( SELECT x.station_id,
            x.month,
            x.dow,
            avg(x.count) AS avg
           FROM ( SELECT inspections.station_id,
                    inspections.date,
                    date_part('month'::text, inspections.date) AS month,
                    EXTRACT(dow FROM inspections.date::timestamp without time zone) AS dow,
                    count(*) AS count
                   FROM inspections
                  GROUP BY inspections.station_id, inspections.date) x
          GROUP BY x.station_id, x.month, x.dow) avgs ON i.station_id = avgs.station_id AND date_part('month'::text, i.date) = avgs.month AND EXTRACT(dow FROM i.date::timestamp without time zone) = avgs.dow
     JOIN ( SELECT x.station_id,
            x.month,
            x.dow,
            stddev(x.count) AS stddev
           FROM ( SELECT inspections.station_id,
                    inspections.date,
                    date_part('month'::text, inspections.date) AS month,
                    EXTRACT(dow FROM inspections.date::timestamp without time zone) AS dow,
                    count(*) AS count
                   FROM inspections
                  GROUP BY inspections.station_id, inspections.date) x
          GROUP BY x.station_id, x.month, x.dow) stddevs ON i.station_id = stddevs.station_id AND date_part('month'::text, i.date) = stddevs.month AND EXTRACT(dow FROM i.date::timestamp without time zone) = stddevs.dow
  WHERE daily_counts.daily_count::numeric > (avgs.avg + 2::numeric * stddevs.stddev)
WITH DATA;

ALTER TABLE IF EXISTS public.inspections_on_frequent_days
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.inspections_on_frequent_days
    IS 'Prohlídky, které se staly na stanici, kde v daný den celkový počet provedených prohlídek překročil průměr + dvě standardní odchylky denního počtu prohlídek pro daný měsíc a den v týdnu napříč všemi lety.';

GRANT ALL ON TABLE public.inspections_on_frequent_days TO postgres;
GRANT SELECT ON TABLE public.inspections_on_frequent_days TO web_anon;"""
        )
    ).all()

    # Count by stations.
    db.conn.execute(
        text(
            """CREATE MATERIALIZED VIEW IF NOT EXISTS public.inspections_on_frequent_days_by_station
TABLESPACE pg_default
AS
 SELECT inspections_on_frequent_days.station_id,
    count(*) AS count
   FROM inspections_on_frequent_days
  GROUP BY inspections_on_frequent_days.station_id
WITH DATA;

ALTER TABLE IF EXISTS public.inspections_on_frequent_days_by_station
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.inspections_on_frequent_days_by_station
    IS 'Počet kontrol provedených v nadměrně frekventované dny podle stanic.';

GRANT ALL ON TABLE public.inspections_on_frequent_days_by_station TO postgres;
GRANT SELECT ON TABLE public.inspections_on_frequent_days_by_station TO web_anon;"""
        )
    ).all()

    # Histogram of counts by stations.
    db.conn.execute(
        text(
            """CREATE MATERIALIZED VIEW IF NOT EXISTS public.inspections_on_frequent_days_by_station_histogram
TABLESPACE pg_default
AS
 SELECT trunc((inspections_on_frequent_days_by_station.count / 100)::double precision) AS hundreds,
    count(*) AS count
   FROM inspections_on_frequent_days_by_station
  GROUP BY (trunc((inspections_on_frequent_days_by_station.count / 100)::double precision))
  ORDER BY (trunc((inspections_on_frequent_days_by_station.count / 100)::double precision))
WITH DATA;

ALTER TABLE IF EXISTS public.inspections_on_frequent_days_by_station_histogram
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.inspections_on_frequent_days_by_station_histogram
    IS 'Histogram po stovkách pro tabulku ''inspections_on_frequent_days_by_station''';

GRANT ALL ON TABLE public.inspections_on_frequent_days_by_station_histogram TO postgres;
GRANT SELECT ON TABLE public.inspections_on_frequent_days_by_station_histogram TO web_anon;"""
        )
    ).all()
