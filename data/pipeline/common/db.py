import os
from sqlalchemy import create_engine, text
import sys
import urllib.parse
from pandas import DataFrame


class Connection:
    """PostgreSQL connection wrapper for Storage saving"""

    def __init__(self):
        """Establish a connection to the database
        data_source: data source database id
        """

        username = urllib.parse.quote_plus(os.environ["POSTGRES_USER"])
        password = urllib.parse.quote_plus(os.environ["POSTGRES_PASSWORD"])
        conn_string = f"postgresql+psycopg2://{username}:{password}@{os.environ['POSTGRES_HOST']}/{os.environ['POSTGRES_DB']}"
        self.db = create_engine(conn_string)
        self.conn = self.db.connect()

    def __del__(self):
        if self.conn:
            self.conn.close()

    def write(self, name: str, df: DataFrame):
        """Replaces table contents with df. The schema must not change?
        Access rights are taken care of."""

        df.to_sql(
            name,
            self.conn,
            if_exists="replace",
            index=False,
        )
        self.conn.execute(text(f"GRANT SELECT ON TABLE public.{name} TO web_anon;"))
        self.conn.commit()

    def grant_api_rights(self, name: str):
        self.conn.execute(text(f"GRANT SELECT ON TABLE public.{name} TO web_anon;"))
        self.conn.commit()
