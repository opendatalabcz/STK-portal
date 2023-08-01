-- Table: public.inspections

-- DROP TABLE IF EXISTS public.inspections;

CREATE TABLE IF NOT EXISTS public.inspections
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    station_id character varying(4) COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    vin character varying(17) COLLATE pg_catalog."default" NOT NULL,
    inspection_type text COLLATE pg_catalog."default",
    vehicle_age integer NOT NULL,
    result text COLLATE pg_catalog."default" NOT NULL,
    mileage integer NOT NULL,
    defects text COLLATE pg_catalog."default",
    defects_a smallint NOT NULL DEFAULT 0,
    defects_b smallint NOT NULL DEFAULT 0,
    defects_c smallint NOT NULL DEFAULT 0,
    defects_0 smallint NOT NULL DEFAULT 0,
    defects_1 smallint NOT NULL DEFAULT 0,
    defects_2 smallint NOT NULL DEFAULT 0,
    defects_3 smallint NOT NULL DEFAULT 0,
    defects_4 smallint NOT NULL DEFAULT 0,
    defects_5 smallint NOT NULL DEFAULT 0,
    defects_6 smallint NOT NULL DEFAULT 0,
    defects_7 smallint NOT NULL DEFAULT 0,
    defects_8 smallint NOT NULL DEFAULT 0,
    defects_9 smallint NOT NULL DEFAULT 0,
    CONSTRAINT inspections_pkey PRIMARY KEY (id),
    CONSTRAINT inspections_inspection_type_check CHECK (inspection_type = ANY (ARRAY['pravidelna'::text, 'opakovana'::text, 'TODO'::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.inspections
    OWNER to postgres;

COMMENT ON TABLE public.inspections
    IS 'Vehicle inspections';