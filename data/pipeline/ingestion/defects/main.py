import os
from sqlalchemy import Connection, text
import pandas as pd
from xml.etree import ElementTree as ET


TABLE = "defects"


def ingest(conn: Connection):
    """Ingest vehicle defects metadata.

    Expects a `defects/defects.xml` file under INGESTION_SOURCES environment variable.
    The file should be obtained from https://zakonyprolidi.cz,
    the HTML table should be extracted to an XML file and renamed.
    """

    print("Importing defects metadata")

    data_dir = (
        os.environ["INGESTION_SOURCES"] + "/defects"
        if "INGESTION_SOURCES" in os.environ
        else "../sources/defect_list/data"
    )
    filename = f"{data_dir}/defect_list.xml"  # TODO: Change

    # Cols for a table of concrete issues
    code = []
    description = []
    type = []

    # Cols for a table of issue categories
    # prefix = []
    # nazev = []

    root = ET.parse(filename).getroot()
    for row in root:
        # Table of concrete issues
        if len(row) == 4:
            code.append(row[1].text)
            description.append(row[2].text)
            type.append(row[3].text)
        elif (
            len(row) == 3 and len(row[2].text) == 1  # type: ignore
        ):  # The second condition is for skipping section headings
            code.append(row[0].text)
            description.append(row[1].text)
            type.append(row[2].text)
        # # Table of issue categories
        # if len(row) == 1 and row[0].text[2] == ' ': # Starts with a digit, dot and space (followed by the issue category name)
        #     prefix.append(row[0].text[0])
        #     nazev.append(row[0].text.split(' ', maxsplit=1)[1].lower())

    defects = pd.DataFrame({"code": code, "description": description, "type": type})

    defects = defects.dropna(how="any", axis=0)

    conn.execute(text(f"TRUNCATE TABLE {TABLE}"))
    conn.commit()

    defects.to_sql(TABLE, conn, index=False, if_exists="append")
