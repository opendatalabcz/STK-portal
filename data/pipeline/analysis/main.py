from common.db import Connection

from .vehicles.average_age_by_drive_type import vehicles_average_age_by_drive_type
from .vehicles.average_age_of_imported import vehicles_average_age_of_imported
from .vehicles.average_age import vehicles_average_age
from .vehicles.average_mileage import vehicles_average_mileage
from .vehicles.colors import vehicles_colors
from .vehicles.drive_type import vehicles_drive_type
from .vehicles.estimated_end_of_life import vehicles_estimated_end_of_life
from .vehicles.imported_vs_new import vehicles_imported_vs_new
from .vehicles.make_popularity import vehicles_make_popularity
from .vehicles.model_popularity import vehicles_model_popularity
from .vehicles.operating_state import vehicles_operating_state
from .vehicles.mileage_by_drive_type import vehicles_mileage_by_drive_type
from .vehicles.average_mileage_by_region import vehicles_average_mileage_by_region

functions = [
    # Dependencies first.
    # vehicles_estimated_end_of_life,
    # The (parallelizable) rest.
    # vehicles_average_age_by_drive_type,
    vehicles_average_age_of_imported,
    # vehicles_average_age,
    # vehicles_average_mileage,
    # vehicles_average_mileage_by_region,
    # vehicles_colors,
    # vehicles_drive_type,
    vehicles_imported_vs_new,
    # vehicles_make_popularity,
    # vehicles_model_popularity,
    # vehicles_operating_state,
    # vehicles_mileage_by_drive_type,
]


def analyze(db: Connection):
    for fn in functions:
        print(f"- {fn.__name__}")
        fn(db)
