from common.db import Connection
from sqlalchemy import text


def stations_average_success_by_model_age(db: Connection):
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.inspections_avg_success_by_model_age;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.inspections_avg_success_by_model_age
TABLESPACE pg_default
AS
 SELECT inspections.make,
    inspections.model_primary,
    trunc(inspections.vehicle_age / 365::double precision) AS age,
    avg(
        CASE
            WHEN inspections.result = '0'::text THEN 1
            WHEN inspections.result <> '0'::text THEN 0
            ELSE NULL::integer
        END) AS avg_success
   FROM inspections
  GROUP BY inspections.make, inspections.model_primary, (trunc(inspections.vehicle_age / 365::double precision))
WITH DATA;

ALTER TABLE IF EXISTS public.inspections_avg_success_by_model_age
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.inspections_avg_success_by_model_age
    IS 'Podíl úspěšných prohlídek podle značky, modelu a věku vozidla';

GRANT ALL ON TABLE public.inspections_avg_success_by_model_age TO postgres;
GRANT SELECT ON TABLE public.inspections_avg_success_by_model_age TO web_anon;
"""
        )
    ).all()
