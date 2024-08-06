"""Data ingestion module"""

import asyncio
import os
import sys

current = os.path.dirname(os.path.realpath(__file__))
sys.path.append(current)

from .common.db import Connection
from .ingestion.main import ingest
from .analysis.main import analyze


def main():
    # Set up database connection.
    print("Connecting to the database\n")
    try:
        conn = Connection()
    except:
        print("Failed to connect to the database", file=sys.stderr)
        sys.exit(1)

    print("# Data ingestion")
    ingest(conn)

    print()
    if "SKIP_ANALYSIS" not in os.environ or os.environ["SKIP_ANALYSIS"] != "1":
        print("# Analysis")
        analyze(conn)


if __name__ == "__main__":

    main()
