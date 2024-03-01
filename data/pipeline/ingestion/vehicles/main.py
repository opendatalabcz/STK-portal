import math
import os
import subprocess
import numpy as np
from sqlalchemy import Connection, text
import pandas as pd


from .functions.fill_names_from_inspections import fill_names_from_inspections
from .functions import pipeline
from .parser import parse, parse_mandatory_columns


TABLE = "vehicles"


def process_mandatory_columns(df: pd.DataFrame):
    df["model_primary"] = df["model_primary"].astype(str)
    # Strip trailing content in parentheses.
    df["model_primary"] = df["model_primary"].apply(lambda x: x.split("(")[0].strip())
    # Remove special characters and duplicate spaces.
    df["model_primary"] = df["model_primary"].str.replace(r"[^\w\s]", "", regex=True)
    df["model_primary"] = df["model_primary"].str.replace("  ", " ")
    df["model_primary"] = df["model_primary"].str.replace("   ", " ")

    models = df["model_primary"]

    # Obtain counts of single-word values in the column.
    sws = models[models.apply(lambda x: len(x.split(" "))) == 1].to_numpy()
    sws_uniq, sws_cnt = np.unique(sws, return_counts=True)

    # Obtain counts of two-word values in the column.
    tws = models[models.apply(lambda x: len(x.split(" "))) == 2].to_numpy()
    tws_uniq, tws_cnt = np.unique(tws, return_counts=True)
    return sws_uniq, sws_cnt, tws_uniq, tws_cnt


def ingest(conn: Connection):
    print("Importing vehicle register data")

    # Prepare table.
    conn.execute(
        text(
            """DROP TABLE IF EXISTS public.vehicles;
            
CREATE TABLE IF NOT EXISTS public.vehicles
(
    vin text COLLATE pg_catalog."default" NOT NULL,
	manufacture_year double precision,
    operating_state text COLLATE pg_catalog."default" NOT NULL,
    first_registration date without time zone,
    first_registration_cz date without time zone,
    primary_type text COLLATE pg_catalog."default",
    secondary_type text COLLATE pg_catalog."default",
    category text COLLATE pg_catalog."default",
    make text COLLATE pg_catalog."default",
    model_primary text COLLATE pg_catalog."default",
    model_secondary text COLLATE pg_catalog."default",
    motor_power double precision,
    motor_volume double precision,
    drive_type text COLLATE pg_catalog."default",
    places double precision,
    color text COLLATE pg_catalog."default",
    wheelbase_size double precision,
    vehicle_length double precision,
    vehicle_width double precision,
    vehicle_height double precision,
    operating_weight double precision,
    permissible_weight double precision,
    connecting_device text COLLATE pg_catalog."default",
    permissible_weight_braked_trailer double precision,
    permissible_weight_unbraked_trailer double precision,
    axles_count double precision,
    tyres_n2 text COLLATE pg_catalog."default",
    tyres_n3 text COLLATE pg_catalog."default",
    tyres_n4 text COLLATE pg_catalog."default",
    rims_n2 text COLLATE pg_catalog."default",
    rims_n3 text COLLATE pg_catalog."default",
    rims_n4 text COLLATE pg_catalog."default",
    max_speed double precision,
    city_consumption double precision,
    average_consumption double precision,
    out_of_city_consumption double precision,
    gearbox text COLLATE pg_catalog."default",
    emissions double precision,
    city_emissions double precision,
    out_of_city_emissions double precision,
    inspection_state text COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.vehicles
    OWNER to postgres;

REVOKE ALL ON TABLE public.inspections FROM web_anon;

GRANT ALL ON TABLE public.inspections TO postgres;

GRANT SELECT ON TABLE public.inspections TO web_anon;"""
        )
    )
    conn.commit()

    data_dir = (
        os.environ["INGESTION_SOURCES"] + "/vehicles"
        if "INGESTION_SOURCES" in os.environ
        else "data/sources/vehicles/data/nosync"
    )
    filename = f"{data_dir}/registr_silnicnich_vozidel_2023-02-24.csv"  # TODO: Change

    print("  - Loading mandatory full columns")
    print("    - Parsing")
    df_mandatory = parse_mandatory_columns(filename)
    print("    - Processing")
    model_primary_frequencies = process_mandatory_columns(df_mandatory)

    print("  - Loading remaining columns in batches")

    # Process in batches to conserve RAM.
    chunk_size = 1000000
    start = 0
    i = 1
    rows = int(subprocess.check_output(["wc", "-l", filename]).split()[0]) - 1
    chunks = math.ceil(rows / chunk_size)
    while start <= rows:
        print(f"    - Chunk {i} of {chunks}")
        chunk = parse(filename, start, chunk_size)
        for fn in pipeline:
            # print(f'      - {fn.__name__}')
            chunk = fn(
                chunk,
                conn=conn,
                min_date=1901,
                model_primary_frequencies=model_primary_frequencies,
            )
        chunk.to_sql(TABLE, conn, index=False, if_exists="append")
        i += 1
        start += chunk_size

    # Remove duplicates across chunks.
    conn.execute(
        text(
            """DELETE FROM vehicles v
WHERE EXISTS (               -- another record exists
    SELECT * FROM vehicles x
    WHERE x.vin = v.vin      -- with the same vin
    AND x.ctid < v.ctid      -- but with a lower internal rowid
    );"""
        )
    )

    # Add primary key
    conn.execute(
        text(
            """ALTER TABLE IF EXISTS public.vehicles
ADD CONSTRAINT vehicles_pkey PRIMARY KEY (vin);

ALTER TABLE IF EXISTS public.vehicles
ADD CONSTRAINT vin_unique UNIQUE (vin);
    """
        )
    )

    # Remove 2023 data as it's incomplete
    conn.execute(
        text(
            """DELETE FROM vehicles
WHERE date_part('year', first_registration) = 2023 OR date_part('year', first_registration_cz) = 2023"""
        )
    )

    conn.commit()
