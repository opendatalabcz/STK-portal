from sqlalchemy import (
    VARCHAR,
    BigInteger,
    Date,
    Integer,
    SmallInteger,
    Text,
    text,
)
import datetime
import collections
import os
from typing import OrderedDict
import numpy as np
import pandas as pd

from common.db import Connection
from .parser import parse
from .functions import pipeline


TABLE = "inspections"


def get_last_record_date(conn: Connection) -> datetime.date:
    """Get the day after the last day with a record from the database
    to resume ingestion.

    Since we import whole months of data, this will not skip anything."""
    try:
        records = conn.conn.execute(
            text(f"SELECT date from {TABLE} ORDER BY date DESC LIMIT 1")
        ).all()

        latest_date = None
        if len(records) == 0:
            latest_date = datetime.date(year=1900, month=1, day=1)
        else:
            latest_date = records[0][0]

        return latest_date
    except:
        conn.conn.rollback()
        return datetime.date(year=1900, month=1, day=1)


def get_record_files() -> OrderedDict[datetime.date, str]:
    """Get a map of months to their filenames.

    Expects a directory with `<whatever>/Data_Prohlidek_<year>_<month>.xml` files."""

    data_dir = os.environ["INSPECTIONS_SOURCE_DIR"]

    files = {}

    for dir in os.listdir(data_dir):
        subdir = data_dir + "/" + dir
        if not os.path.isdir(subdir):
            continue
        for filename in os.listdir(subdir):
            year = int(filename.split(".")[0].split("_")[2])
            month = int(filename.split(".")[0].split("_")[3])
            date = datetime.date(year=year, month=month, day=1)

            files[date] = subdir + "/" + filename

    return collections.OrderedDict(sorted(files.items()))


def apply_pipeline(filename: str, **kwargs) -> pd.DataFrame:
    print("  - Parsing")
    df = parse(filename)

    print("  - Applying pipeline")
    for fn in pipeline:
        print(f"    - {fn.__name__}")
        df = fn(df, **kwargs)

    return df


def ingest(conn: Connection):
    print("Importing inspection data")

    # Prepare table
    conn.conn.execute(
        text(
            """CREATE SEQUENCE IF NOT EXISTS public.inspections_id_seq;

ALTER SEQUENCE public.inspections_id_seq
    OWNER TO postgres;
            
            CREATE TABLE IF NOT EXISTS public.inspections
(
    station_id text COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    vin text COLLATE pg_catalog."default" NOT NULL,
    inspection_type text COLLATE pg_catalog."default" NOT NULL,
    result text COLLATE pg_catalog."default" NOT NULL,
    mileage integer NOT NULL,
    defects text COLLATE pg_catalog."default",
    make text COLLATE pg_catalog."default",
    model_primary text COLLATE pg_catalog."default",
    first_registration date,
    defects_a bigint,
    defects_b bigint,
    defects_c bigint,
    defects_0 bigint,
    defects_1 bigint,
    defects_2 bigint,
    defects_3 bigint,
    defects_4 bigint,
    defects_5 bigint,
    defects_6 bigint,
    defects_7 bigint,
    defects_8 bigint,
    defects_9 bigint,
    vehicle_age double precision,
    id bigint NOT NULL DEFAULT nextval('inspections_id_seq'::regclass),
    CONSTRAINT inspections_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.inspections
    OWNER to postgres;

REVOKE ALL ON TABLE public.inspections FROM web_anon;

GRANT ALL ON TABLE public.inspections TO postgres;

GRANT SELECT ON TABLE public.inspections TO web_anon;

CREATE INDEX IF NOT EXISTS vin_index
ON public.inspections USING btree
(vin COLLATE pg_catalog."default" ASC NULLS LAST)
TABLESPACE pg_default;"""
        )
    )
    conn.conn.commit()

    # Parse data since start_date.
    latest_date = get_last_record_date(conn)
    if latest_date.year == 1900:
        print("- No records found, importing everything")
    else:
        print(f"- Latest record is from {latest_date}, importing newer data")

    # Prepare metadata for pipeline functions.
    station_ids = [
        row[0] for row in conn.conn.execute(text("SELECT id FROM stations")).all()
    ]
    defects = pd.read_sql(
        "SELECT code, description, type FROM defects",
        conn.conn,
        index_col="code",
        dtype={"code": "str", "description": "str", "type": "category"},
    )

    files = get_record_files()

    parsed_some = False

    for date, filename in files.items():
        if date > latest_date:  # Must be next month
            print(f"- {date.year}-{date.month:02}")
            df = apply_pipeline(
                filename, date=date, station_ids=station_ids, defects=defects
            )
            print(f"  - Writing to DB")
            df.to_sql(
                TABLE,
                conn.conn,
                if_exists="append",
                index=False,
                dtype={
                    "station_id": Text,
                    "date": Date,
                    "vin": Text,
                    "inspection_type": Text,
                    "result": Text,
                    "mileage": BigInteger,
                    "defects": Text,
                    "make": Text,
                    # 'motor_type': motor_type,
                    # "vehicle_type": vehicle_type,
                    "model_primary": Text,
                    # 'vehicle_class': vehicle_class,
                    "first_registration": Date,
                },
            )
            conn.conn.commit()

            parsed_some = True

    if not parsed_some:
        print("- No new data found")
