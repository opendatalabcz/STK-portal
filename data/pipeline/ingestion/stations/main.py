import os
import re
import requests
from sqlalchemy import text
import pandas as pd

from common.db import Connection


TABLE = "stations"


def remove_dots(item):
    return item[0:2] + item[3:5]


def split_array_type(item: str):
    return re.split("; |, ", item)


def join_array_type(array):
    return " ".join(array)


def get_coords(row, session: requests.Session, token: str):
    data = {
        "search": f'{row["street"]} {row["city"]}',
        "csrf_token": token,
        "token": "",
        "output_displ": "json",
    }

    try:
        r = session.post("https://geolokator.profinit.cz/", data=data)
        data = r.json()
        x = data["results"][0]["ruian"]["wgs_x"]
        y = data["results"][0]["ruian"]["wgs_y"]
        return x, y
    except:
        return None, None


def ingest(conn: Connection):
    """Ingest STK metadata.

    Expects a `stations/stations.xlsx` file under INGESTION_SOURCES environment variable.
    The file should be obtained from https://www.mdcr.cz/Dokumenty/Silnicni-doprava/STK/STK-Seznam-STK-dle-kraju?returl=/Dokumenty/Silnicni-doprava/STK
    and renamed.
    """

    print("Importing STK metadata")

    print("  - Parsing input")

    stations = pd.read_excel(
        os.environ["STATIONS_SOURCE"],
        skiprows=[0, 1],
        usecols="A:H,K",
        names=[
            "id",
            "inspection_types",
            "postal_code",
            "city",
            "street",
            "company",
            "phones",
            "emails",
            "nuts3",
        ],
        dtype="str",
    )
    stations["id"] = stations["id"].apply(remove_dots)
    stations["inspection_types"] = stations["inspection_types"].apply(split_array_type)
    stations["phones"] = stations["phones"].apply(split_array_type)
    stations["emails"] = stations["emails"].apply(split_array_type)

    # Obtain geo coordinates using https://geolokator.profinit.cz/
    print("  - Finding coordinates for addresses")
    try:

        # Prepare session.
        session = requests.Session()
        r = session.get("https://geolokator.profinit.cz/")
        token = re.search(
            r'name="csrf_token"type="hidden"value="([^"]+)">',
            r.text.replace("\n", "").replace(" ", ""),
            re.MULTILINE,
        ).group(1)

        stations[["latitude", "longitude"]] = stations.apply(
            get_coords, axis=1, result_type="expand", session=session, token=token
        )
    except:
        print("    - Failed to find coordinates using geolokator.profinit.cz")
        stations[["latitude", "longitude"]] = None

    # Add pure text fields for full-text-search.
    stations["inspection_types_fts"] = stations["inspection_types"].apply(
        join_array_type
    )
    stations["emails_fts"] = stations["emails"].apply(join_array_type)
    stations["phones_fts"] = stations["phones"].apply(join_array_type)

    try:
        conn.conn.execute(text(f"TRUNCATE TABLE {TABLE}"))
    except:
        conn.conn.rollback()
    stations.to_sql(TABLE, conn.conn, index=False, if_exists="append")
    conn.grant_api_rights(TABLE)


# pyright: reportOptionalMemberAccess=false
