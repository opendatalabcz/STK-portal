from sqlalchemy import Connection

from .vehicles.changes_in_time.average_age import vehicles_changes_in_time_average_age

functions = [
    vehicles_changes_in_time_average_age
]

def analyze(conn: Connection):
    for fn in functions:
        print(f'- {fn.__name__}')
        fn(conn)
