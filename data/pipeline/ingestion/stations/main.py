import os
from sqlalchemy import Connection, text
import pandas as pd


TABLE = 'stations'


def remove_dots(item):
    return item[0:2] + item[3:5]

def ingest(conn: Connection):
    """Ingest STK metadata.
    
    Expects a `stations/stations.xlsx` file under INGESTION_SOURCES environment variable.
    The file should be obtained from https://www.mdcr.cz/Dokumenty/Silnicni-doprava/STK/STK-Seznam-STK-dle-kraju?returl=/Dokumenty/Silnicni-doprava/STK
    and renamed.
    """

    print('Importing STK metadata')

    data_dir = os.environ['INGESTION_SOURCES'] + '/stations' \
        if 'INGESTION_SOURCES' in os.environ \
        else '../sources/station_list/data'

    stations = pd.read_excel(
        f'{data_dir}/Aktualni-data-STK-na-web-MD-2023-04.xlsx', # TODO: Change
        skiprows=[0, 1],
        usecols='A,K',
        names=['id', 'nuts3'],
        dtype='str',
    )
    stations['id'] = stations['id'].apply(remove_dots)

    conn.execute(text(f'TRUNCATE TABLE {TABLE}'))
    conn.commit()

    stations.to_sql(TABLE, conn, index=False, if_exists='append')
