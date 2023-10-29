from sqlalchemy import Connection, text
import datetime
import collections
import os
from typing import OrderedDict
import numpy as np
import pandas as pd

from .parser import parse
from .functions import pipeline


TABLE = 'inspections'

def get_last_record_date(conn: Connection) -> datetime.date:
    """Get the day after the last day with a record from the database
    to resume ingestion.
    
    Since we import whole months of data, this will not skip anything."""
    records = conn.execute(text(f'SELECT date from {TABLE} ORDER BY date DESC LIMIT 1')).all()

    latest_date = None
    if len(records) == 0:
        latest_date = datetime.date(year=1900, month=1, day=1)
    else:
        latest_date = records[0][0]

    return latest_date

def get_record_files() -> OrderedDict[datetime.date, str]:
    """Get a map of months to their filenames.
    
    Expects a directory with `<whatever>/Data_Prohlidek_<year>_<month>.xml` files."""

    data_dir = os.environ['INGESTION_SOURCES'] + '/inspections' \
        if 'INGESTION_SOURCES' in os.environ \
        else '../sources/inspections/data/nosync/data_raw' # TODO: Remove in production.

    files = {}

    for dir in os.listdir(data_dir):
        subdir = data_dir + '/' + dir
        if not os.path.isdir(subdir):
            continue
        for filename in os.listdir(subdir):
            year = int(filename.split('.')[0].split('_')[2])
            month = int(filename.split('.')[0].split('_')[3])
            date = datetime.date(year=year, month=month, day=1)
            
            files[date] = subdir + '/' + filename
    
    return collections.OrderedDict(sorted(files.items()))


def apply_pipeline(filename: str, **kwargs) -> pd.DataFrame:
    print('  - Parsing')
    df = parse(filename)

    print('  - Applying pipeline')
    for fn in pipeline:
        print(f'    - {fn.__name__}')
        df = fn(df, **kwargs)

    return df


def ingest(conn: Connection):
    print('Importing inspection data')

    # Parse data since start_date.
    latest_date = get_last_record_date(conn)
    if latest_date.year == 1900:
        print('- No records found, importing everything')
    else:
        print(f'- Latest record is from {latest_date}, importing newer data')

    # Prepare metadata for pipeline functions.
    station_ids = [row[0] for row in conn.execute(text('SELECT id FROM stations')).all()]
    defects = pd.read_sql('SELECT code, description, type FROM defects', conn, index_col='code', dtype={
        'code': 'str',
        'description': 'str',
        'type': 'category'
    })

    files = get_record_files()

    parsed_some = False

    for date, filename in files.items():
        if date > latest_date: # Must be next month
            print(f'- {date.year}-{date.month:02}')
            df = apply_pipeline(filename,
                                date=date,
                                station_ids=station_ids,
                                defects=defects)
            print(f'  - Writing to DB')
            df.to_sql(TABLE, conn, if_exists='append', index=False)
            conn.commit()

            parsed_some = True

    if not parsed_some:
        print('- No new data found')