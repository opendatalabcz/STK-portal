from common.db import Connection
from sqlalchemy import text


def vehicles_make_model_list(db: Connection):
    db.conn.execute(
        text(
            """DROP MATERIALIZED VIEW IF EXISTS public.models;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.models
TABLESPACE pg_default
AS
 SELECT DISTINCT vehicles.make,
    vehicles.model_primary AS model
   FROM vehicles
WITH DATA;

ALTER TABLE IF EXISTS public.models
    OWNER TO postgres;

GRANT ALL ON TABLE public.models TO postgres;
GRANT SELECT ON TABLE public.models TO web_anon;"""
        )
    ).all()
