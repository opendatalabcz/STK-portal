import os
from sqlalchemy import create_engine
import sys
import urllib.parse

class Connection:
    """PostgreSQL connection wrapper for Storage saving
    """

    def __init__(self):
        """Establish a connection to the database
        data_source: data source database id
        """

        self.db = None
        self.conn = None
        
        try:
            username = urllib.parse.quote_plus(os.environ['POSTGRES_USER'])
            password = urllib.parse.quote_plus(os.environ['POSTGRES_PASSWORD'])
            conn_string = f"postgresql+psycopg2://{username}:{password}@{os.environ['POSTGRES_HOST']}/{os.environ['POSTGRES_DB']}"
            self.db = create_engine(conn_string)
            self.conn = self.db.connect()
        except:
            print('Failed to connect to the database', file=sys.stderr)
            sys.exit(1)

        # try:
        #     self.conn = psycopg2.connect(
        #         host=os.environ['POSTGRES_HOST'],
        #         port=os.environ['POSTGRES_PORT'],
        #         database=os.environ['POSTGRES_DB'],
        #         user=os.environ['POSTGRES_USER'],
        #         password=os.environ['POSTGRES_PASSWORD'])
        #     self.cur = self.conn.cursor()
        # except (ConnectionAbortedError, ConnectionError,
        #     ConnectionRefusedError, ConnectionResetError):
        #     print('Failed to connect to the database', file=sys.stderr)
        #     sys.exit(1)

    def __del__(self):
        # if self.cur:
        #     self.cur.close()
        if self.conn:
            self.conn.close()

    # def execute(self, query):
    #     self.cur.execute(query)
    
    # def commit(self):
    #     self.conn.commit()
