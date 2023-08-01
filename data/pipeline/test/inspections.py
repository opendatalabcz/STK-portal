import unittest
from ..ingestion.inspections import main
from .. import db

import numpy as np

class Test(unittest.TestCase):
    def setUp(self) -> None:
        self.db = db.Connection() 

        return super().setUp()

    def test_get_newest_record_date(self):
        start_date = main.get_last_record_date(self.db)
        self.assertEqual(start_date, np.datetime64('1900'))