from .process_missing import process_missing
from .filter_vehicle_types import filter_vehicle_types
from .filter_duplicates import filter_duplicates
from .filter_vins import filter_vins
from .parse_date_of_manufacture import parse_date_of_manufacture
from .process_registration_dates import process_registration_dates
from .group_models import group_models
from .filter_motor_power import filter_motor_power
from .filter_motor_volume import filter_motor_volume
from .parse_drive_type import parse_drive_type
from .parse_places import parse_places
from .filter_dimensions import filter_dimensions
from .filter_weight import filter_weight
from .filter_axles_count import filter_axles_count
from .filter_max_speed import filter_max_speed
from .filter_consumption import filter_consumption
from .filter_emissions import filter_emissions

# The order of the pipeline operations is defined here.
pipeline = [
    process_missing,
    filter_vehicle_types,
    filter_duplicates,
    filter_vins,
    parse_date_of_manufacture,
    process_registration_dates,
    group_models,
    filter_motor_power,
    filter_motor_volume,
    parse_drive_type,
    parse_places,
    filter_dimensions,
    filter_weight,
    filter_axles_count,
    filter_max_speed,
    filter_consumption,
    filter_emissions,
]