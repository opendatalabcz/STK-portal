import os
from ..common.db import Connection
from .stations.main import ingest as stations_ingest
from .defects.main import ingest as defects_ingest
from .inspections.main import ingest as inspections_ingest
from .vehicles.main import ingest as vehicles_ingest


def ingest(conn: Connection):
    """Ingest all data sources."""

    if "STATIONS_SOURCE" in os.environ:
        stations_ingest(conn)

    if "DEFECTS_SOURCE" in os.environ:
        defects_ingest(conn)

    if "INSPECTIONS_SOURCE_DIR" in os.environ:
        inspections_ingest(conn)  # Requires stations and defects to be ingested.

    if "VEHICLES_SOURCE" in os.environ:
        vehicles_ingest(conn.conn)  # Requires inspections to be ingested.
