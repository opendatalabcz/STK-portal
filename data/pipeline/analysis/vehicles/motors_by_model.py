from common.db import Connection
from sqlalchemy import text


def vehicles_motors_by_model(db: Connection):
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.vehicles_motors_by_model;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.vehicles_motors_by_model
TABLESPACE pg_default
AS
    SELECT make,
        model_primary,
        drive_type,
        MIN(motor_volume) AS min_motor_volume,
        MAX(motor_volume) AS max_motor_volume,
        MIN(motor_power) AS min_motor_power,
        MAX(motor_power) AS max_motor_power
    FROM vehicles
    GROUP BY make, model_primary, drive_type
WITH DATA;

ALTER TABLE IF EXISTS public.vehicles_motors_by_model
    OWNER TO postgres;

COMMENT ON MATERIALIZED VIEW public.vehicles_motors_by_model
    IS 'Výčet typů pohonu a rozsahů parametrů motoru pro každý model vozidla';

GRANT ALL ON TABLE public.vehicles_motors_by_model TO postgres;
GRANT SELECT ON TABLE public.vehicles_motors_by_model TO web_anon;"""
        )
    )
    db.conn.commit()
