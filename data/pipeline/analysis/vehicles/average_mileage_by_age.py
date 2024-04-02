from common.db import Connection
from sqlalchemy import text


def vehicles_average_mileage_by_age(db: Connection):
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.vehicles_average_mileage_by_age;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.vehicles_average_mileage_by_age
TABLESPACE pg_default
AS
 SELECT inspections.make,
    inspections.model_primary,
    trunc(inspections.vehicle_age / 365::double precision) AS age,
    avg(inspections.mileage) AS avg_mileage
   FROM inspections
  GROUP BY inspections.make, inspections.model_primary, (trunc(inspections.vehicle_age / 365::double precision))
WITH DATA;

ALTER TABLE IF EXISTS public.vehicles_average_mileage_by_age
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.vehicles_average_mileage_by_age
    IS 'Průměrný nájezd vozidel podle značky, modelu a věku v letech';

GRANT ALL ON TABLE public.vehicles_average_mileage_by_age TO postgres;
GRANT SELECT ON TABLE public.vehicles_average_mileage_by_age TO web_anon;"""
        )
    ).all()
