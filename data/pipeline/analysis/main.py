from common.db import Connection

from .inspections.average_inspection_count_by_severity_by_nuts3 import (
    stations_average_inspection_count_by_severity_by_nuts3,
)
from .inspections.average_inspection_frequency import (
    stations_average_inspection_frequency,
)
from .inspections.average_inspection_result import stations_average_inspection_result
from .inspections.average_success_by_model_age import (
    stations_average_success_by_model_age,
)
from .inspections.average_defects_by_severity_model_age import (
    stations_average_defects_by_severity_model_age,
)
from .inspections.defect_counts import stations_defect_counts
from .inspections.defect_counts_by_category import stations_defect_counts_by_category
from .inspections.disappearing_failures import stations_dissapearing_failures
from .inspections.inspection_failure_reasons import stations_inspection_failure_reasons
from .inspections.inspection_success_by_make import stations_inspection_success_by_make
from .inspections.inspection_success_by_model import (
    stations_inspection_success_by_model,
)
from .inspections.inspections_on_frequent_days import (
    stations_inspections_on_frequent_days,
)
from .inspections.repeated_inspections_on_different_station import (
    stations_repeated_inspections_on_different_station,
)
from .inspections.top_makes_by_station import stations_top_makes_by_station
from .inspections.top_models_by_station import stations_top_models_by_station
from .inspections.total_anomalies import stations_total_anomalies
from .vehicles.average_age_by_drive_type import vehicles_average_age_by_drive_type
from .vehicles.average_age_of_imported import vehicles_average_age_of_imported
from .vehicles.average_age import vehicles_average_age
from .vehicles.average_mileage import vehicles_average_mileage
from .vehicles.average_mileage_by_age import vehicles_average_mileage_by_age
from .vehicles.average_mileage_by_region import vehicles_average_mileage_by_region
from .vehicles.colors import vehicles_colors
from .vehicles.defect_prediction import vehicles_defect_prediction
from .vehicles.drive_type import vehicles_drive_type
from .vehicles.estimated_end_of_life import vehicles_estimated_end_of_life
from .vehicles.imported_vs_new import vehicles_imported_vs_new
from .vehicles.make_model_list import vehicles_make_model_list
from .vehicles.make_popularity import vehicles_make_popularity
from .vehicles.mileage_by_drive_type import vehicles_mileage_by_drive_type
from .vehicles.mileage_prediction import vehicles_mileage_prediction
from .vehicles.model_popularity import vehicles_model_popularity
from .vehicles.motors_by_model import vehicles_motors_by_model
from .vehicles.operating_state import vehicles_operating_state

functions = [
    #### Dependencies first (parallelizable).
    vehicles_estimated_end_of_life,
    stations_dissapearing_failures,
    stations_inspections_on_frequent_days,
    stations_repeated_inspections_on_different_station,
    #### The (parallelizable) rest.
    stations_average_defects_by_severity_model_age,
    stations_average_inspection_count_by_severity_by_nuts3,
    stations_average_inspection_frequency,
    stations_average_inspection_result,
    stations_average_success_by_model_age,
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
    vehicles_average_mileage_by_age,
    vehicles_average_mileage_by_region,
    vehicles_colors,
    vehicles_drive_type,
    vehicles_imported_vs_new,
    vehicles_make_model_list,
    vehicles_make_popularity,
    vehicles_mileage_by_drive_type,
    vehicles_model_popularity,
    vehicles_motors_by_model,
    vehicles_operating_state,
    stations_total_anomalies,  # Depends on stations_inspections_on_frequent_days, stations_repeated_inspections_on_different_station, stations_dissapearing_failures
    #### CatBoost models last in this order
    vehicles_defect_prediction,
    vehicles_mileage_prediction,  # Depends on vehicles_defect_prediction
]


def analyze(db: Connection):
    for fn in functions:
        print(f"- {fn.__name__}")
        fn(db)
