"""Data ingestion module"""

import db
from ingestion.main import ingest

if __name__ == "__main__":
    # Set up database connection.
    db = db.Connection()

    # Ingest data.
    ingest(db.conn)