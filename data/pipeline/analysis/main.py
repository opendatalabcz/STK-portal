from common.db import Connection

from .inspections.average_inspection_count_by_severity_by_nuts3 import (
    stations_average_inspection_count_by_severity_by_nuts3,
)
from .inspections.average_inspection_frequency import (
    stations_average_inspection_frequency,
)
from .inspections.average_inspection_result import stations_average_inspection_result
from .inspections.defect_counts import stations_defect_counts
from .inspections.defect_counts_by_category import stations_defect_counts_by_category
from .inspections.inspection_failure_reasons import stations_inspection_failure_reasons
from .inspections.inspection_success_by_make import stations_inspection_success_by_make
from .inspections.inspection_success_by_model import (
    stations_inspection_success_by_model,
)
from .inspections.top_makes_by_station import stations_top_makes_by_station
from .inspections.top_models_by_station import stations_top_models_by_station
from .vehicles.average_age_by_drive_type import vehicles_average_age_by_drive_type
from .vehicles.average_age_of_imported import vehicles_average_age_of_imported
from .vehicles.average_age import vehicles_average_age
from .vehicles.average_mileage import vehicles_average_mileage
from .vehicles.average_mileage_by_region import vehicles_average_mileage_by_region
from .vehicles.colors import vehicles_colors
from .vehicles.defect_prediciton import vehicles_defect_prediction
from .vehicles.drive_type import vehicles_drive_type
from .vehicles.estimated_end_of_life import vehicles_estimated_end_of_life
from .vehicles.imported_vs_new import vehicles_imported_vs_new
from .vehicles.make_popularity import vehicles_make_popularity
from .vehicles.mileage_by_drive_type import vehicles_mileage_by_drive_type
from .vehicles.mileage_prediction import vehicles_mileage_prediction
from .vehicles.model_popularity import vehicles_model_popularity
from .vehicles.operating_state import vehicles_operating_state

functions = [
    #### Dependencies first.
    vehicles_estimated_end_of_life,
    #### The (parallelizable) rest.
    stations_average_inspection_count_by_severity_by_nuts3,
    stations_average_inspection_frequency,
    stations_average_inspection_result,
    stations_defect_counts_by_category,
    stations_defect_counts,
    stations_inspection_failure_reasons,
    stations_inspection_success_by_make,
    stations_inspection_success_by_model,
    stations_top_makes_by_station,
    stations_top_models_by_station,
    vehicles_average_age_by_drive_type,  # Depends on vehicles_estimated_end_of_life
    vehicles_average_age_of_imported,  # Depends on vehicles_estimated_end_of_life
    vehicles_average_age,  # Depends on vehicles_estimated_end_of_life
    vehicles_average_mileage,
    vehicles_average_mileage_by_region,
    vehicles_colors,
    vehicles_defect_prediction,
    vehicles_drive_type,
    vehicles_imported_vs_new,
    vehicles_operating_state,
    vehicles_make_popularity,
    vehicles_mileage_by_drive_type,
    vehicles_mileage_prediction,  # Depends on vehicles_defect_prediction
    vehicles_model_popularity,
]


def analyze(db: Connection):
    for fn in functions:
        print(f"- {fn.__name__}")
        fn(db)
