import os
import time
import re
import requests
from sqlalchemy import Connection, text
import pandas as pd
from geopy.geocoders import Nominatim
from geopy.adapters import RequestsAdapter
from geopy.extra.rate_limiter import RateLimiter


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

    data_dir = (
        os.environ["INGESTION_SOURCES"] + "/stations"
        if "INGESTION_SOURCES" in os.environ
        else "../sources/station_list/data"
    )

    stations = pd.read_excel(
        f"{data_dir}/Aktualni-data-STK-na-web-MD-2023-04.xlsx",  # TODO: Change
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

    # Add pure text fields for full-text-search.
    stations["inspection_types_fts"] = stations["inspection_types"].apply(
        join_array_type
    )
    stations["emails_fts"] = stations["emails"].apply(join_array_type)
    stations["phones_fts"] = stations["phones"].apply(join_array_type)

    conn.execute(text(f"TRUNCATE TABLE {TABLE}"))
    conn.commit()

    stations.to_sql(TABLE, conn, index=False, if_exists="append")


# pyright: reportOptionalMemberAccess=false
