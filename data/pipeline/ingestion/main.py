from sqlalchemy import Connection

from .stations.main import ingest as stations_ingest
from .defects.main import ingest as defects_ingest
from .inspections.main import ingest as inspections_ingest

def ingest(conn: Connection):
    """Ingest all data sources."""

    stations_ingest(conn)
    defects_ingest(conn)
    inspections_ingest(conn) # Requires stations and defects to be ingested.