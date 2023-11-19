type Vehicle = {
  id: bigint;
  vin: string;
  first_registration: string | null;
  first_registration_cz: string | null;
  manufacture_year: number | null;
  primary_type: string | null;
  secondary_type: string | null;
  category: string | null;
  make: string | null;
  model_primary: string | null;
  model_secondary: string | null;
  motor_power: number | null;
  motor_volume: number | null;
  drive_type: string | null;
  places: number | null;
  color: string | null;
  wheelbase_size: number | null;
  vehicle_length: number | null;
  vehicle_width: number | null;
  vehicle_height: number | null;
  operating_weight: number | null;
  permissible_weight: number | null;
  connecting_device: string | null;
  permissible_weight_braked_trailer: number | null;
  permissible_weight_unbraked_trailer: number | null;
  axles_count: number | null;
  tyres_n1: string | null;
  tyres_n2: string | null;
  tyres_n3: string | null;
  tyres_n4: string | null;
  rims_n1: string | null;
  rims_n2: string | null;
  rims_n3: string | null;
  rims_n4: string | null;
  max_speed: number | null;
  average_consumption: number | null;
  city_consumption: number | null;
  out_of_city_consumption: number | null;
  gearbox: string | null;
  emissions: number | null;
  city_emissions: number | null;
  out_of_city_emissions: number | null;
  inspection_state: string;
  operating_state: string;
};
