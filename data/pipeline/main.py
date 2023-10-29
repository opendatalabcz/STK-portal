"""Data ingestion module"""

import asyncio

from common.db import Connection
from ingestion.main import ingest
from analysis.main import analyze

async def main():
    # Set up database connection.
    print('Connecting to the database')
    db = Connection()

    print('# Data ingestion')
    ingest(db.conn)

    print()
    print('# Analysis')
    analyze(db.conn)


if __name__ == "__main__":
    asyncio.run(main())