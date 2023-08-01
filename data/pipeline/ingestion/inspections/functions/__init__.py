from .process_missing import process_missing
from .filter_vehicle_types import filter_vehicle_types
from .filter_incomplete import filter_incomplete
from .filter_vins import filter_vins
from .filter_unknown_stations import filter_unknown_stations
from .transform_inspection_type import transform_inspection_type
from .format_date import format_date
from .filter_dates_out_of_range import filter_dates_out_of_range
from .transform_result import transform_result
from .count_failures_by_type import count_failures_by_type
from .count_failures_by_first_level_category import count_failures_by_first_level_category
from .add_vehicle_age import add_vehicle_age
from .filter_duplicates import filter_duplicates
from .drop_extra_columns import drop_extra_columns

# The order of the pipeline operations is defined here.
pipeline = [
    process_missing,
    filter_vehicle_types,
    filter_incomplete,
    filter_vins,
    filter_unknown_stations,
    transform_inspection_type,
    format_date,
    filter_dates_out_of_range,
    transform_result,
    count_failures_by_type,
    count_failures_by_first_level_category,
    add_vehicle_age,
    filter_duplicates,
    drop_extra_columns,
]