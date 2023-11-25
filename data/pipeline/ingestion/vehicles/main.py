import math
import os
import subprocess
import numpy as np
from sqlalchemy import Connection, text
import pandas as pd

from .parser import parse, parse_mandatory_columns
from .functions import pipeline


TABLE = 'vehicles'

def process_mandatory_columns(df: pd.DataFrame) -> pd.DataFrame:
    df['model_primary'] = df['model_primary'].astype('str')
    # Strip trailing content in parentheses.
    df['model_primary'] = df['model_primary'].apply(lambda x: x.split('(')[0].strip())
    # Remove special characters and duplicate spaces.
    df['model_primary'] = df['model_primary'].str.replace('[^\w\s]', '', regex=True)
    df['model_primary'] = df['model_primary'].str.replace('  ', ' ')
    df['model_primary'] = df['model_primary'].str.replace('   ', ' ')

    models = df['model_primary']

    # Obtain counts of single-word values in the column.
    sws = models[models.apply(lambda x: len(
        x.split(' '))) == 1].to_numpy()
    sws_uniq, sws_cnt = np.unique(sws, return_counts=True)

    # Obtain counts of two-word values in the column.
    tws = models[models.apply(lambda x: len(
        x.split(' '))) == 2].to_numpy()
    tws_uniq, tws_cnt = np.unique(tws, return_counts=True)
    return sws_uniq, sws_cnt, tws_uniq, tws_cnt

def ingest(conn: Connection):
    print('Importing vehicle register data')

    data_dir = os.environ['INGESTION_SOURCES'] + '/vehicles' \
        if 'INGESTION_SOURCES' in os.environ \
        else '../sources/vehicles/data/nosync'
    filename = f'{data_dir}/registr_silnicnich_vozidel_2023-02-24.csv' # TODO: Change

    print('  - Loading mandatory full columns')
    print('    - Parsing')
    df_mandatory = parse_mandatory_columns(filename)
    print('    - Processing')
    model_primary_frequencies = process_mandatory_columns(df_mandatory)

    conn.execute(text(f'TRUNCATE TABLE {TABLE}'))
    conn.commit()

    print('  - Loading remaining columns in batches')

    # Process in batches to conserve RAM.
    chunk_size = 1000000
    start = 0
    i = 1
    rows = int(subprocess.check_output(['wc', '-l', filename]).split()[0]) - 1
    chunks = math.ceil(rows / chunk_size)
    while start <= rows:
        print(f'    - Chunk {i} of {chunks}')
        chunk = parse(filename, start, chunk_size)
        for fn in pipeline:
            # print(f'      - {fn.__name__}')
            chunk = fn(chunk, min_date=1901, model_primary_frequencies=model_primary_frequencies)
        chunk.to_sql(TABLE, conn, index=False, if_exists='append')
        i += 1
        start += chunk_size
