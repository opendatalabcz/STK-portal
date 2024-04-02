from common.db import Connection
from sqlalchemy import text


def stations_average_defects_by_severity_model_age(db: Connection):
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.inspections_avg_defects_by_severity_model_age;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.inspections_avg_defects_by_severity_model_age
TABLESPACE pg_default
AS
 SELECT inspections.make,
    inspections.model_primary,
    trunc(inspections.vehicle_age / 365::double precision) AS age,
    avg(inspections.defects_a) AS avg_defects_a,
    avg(inspections.defects_b) AS avg_defects_b,
    avg(inspections.defects_c) AS avg_defects_c
   FROM inspections
  GROUP BY inspections.make, inspections.model_primary, (trunc(inspections.vehicle_age / 365::double precision))
WITH DATA;

ALTER TABLE IF EXISTS public.inspections_avg_defects_by_severity_model_age
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.inspections_avg_defects_by_severity_model_age
    IS 'Průměrné počty nalezených závad dle závažnosti pro vozidla podle značek, modelů a věku v celých letech ';

GRANT ALL ON TABLE public.inspections_avg_defects_by_severity_model_age TO postgres;
GRANT SELECT ON TABLE public.inspections_avg_defects_by_severity_model_age TO web_anon;
"""
        )
    ).all()
