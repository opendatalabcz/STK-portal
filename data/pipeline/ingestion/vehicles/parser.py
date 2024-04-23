from xml.etree import ElementTree as ET
import pandas as pd
import numpy as np


def parse_mandatory_columns(filepath: str) -> pd.DataFrame:
    """Parse only the columns required for further streamed parsing."""
    cols = [
        "Obchodní označení",
    ]

    dtype = {
        "Obchodní označení": "category",  # 'Obchodní označení',
    }

    df = pd.read_csv(
        filepath,
        usecols=cols,
        sep="|",
        dtype=dtype,
        true_values=["True"],
        false_values=["False"],
        na_values=["", "NEUVEDENO"],
        thousands=" ",
        decimal=",",
        encoding="cp1250",
        encoding_errors="ignore",
    )

    return df.rename(
        columns={
            "Obchodní označení": "model_primary",
        }
    )


def parse(filepath: str, start: int, chunk_size: int):
    cols = [
        "Rok výroby",
        "Stav",
        "1. registrace",
        "1. registrace ČR",
        "Druh",
        "Druh 2. ř.",
        "Kategorie",
        "Tovární značka",
        "Varianta název",
        "Obchodní označení",
        "VIN",
        "Motor/Max. výkon",
        "Motor/Zdvihový objem",
        "Palivo",
        "Míst celkem",
        "Barva",
        "Rozvor",
        "Délka",
        "Šířka",
        "Výška",
        "Provozní hmotnost",
        "Přípustná hmotnost",
        "Spojovací zařízení (SZ)",
        "Přípustná SZ brzděného",
        "Přípustná SZ nebrzděného",
        "Nápravy počet",
        "Pneumatiky N1",
        "Pneumatiky N1",
        "Pneumatiky N3",
        "Pneumatiky N4",
        "Ráfky N1",
        "Ráfky N1",
        "Ráfky N3",
        "Ráfky N4",
        "Max. rychlost",
        "Spotřeba průměrná",
        "Spotřeba město",
        "Spotřeba mimo město",
        "Převodovka",
        "Emise CO2",
        "Emise CO2/město",
        "Emise CO2/mimo město",
        "Prohlídka status",
    ]

    dtype = {
        "Rok výroby": np.float64,  # 'Rok výroby',
        "Stav": "category",  # 'Stav',
        "1. registrace": "object",  # '1. registrace',
        "1. registrace ČR": "object",  # '1. registrace ČR',
        "Druh": "category",  # 'Druh',
        "Druh 2. ř.": "category",  # 'Druh 2. ř.',
        "Kategorie": "category",  # 'Kategorie',
        "Tovární značka": "category",  # 'Tovární značka',
        "Varianta název": "category",  # 'Varianta název',
        "Obchodní označení": "category",  # 'Obchodní označení',
        "VIN": "object",  # 'vin',
        "Motor/Max. výkon": np.float64,  # 'Motor/Max. výkon',
        "Motor/Zdvihový objem": np.float64,  # 'Motor/Zdvihový objem',
        "Palivo": "category",  # 'Palivo',
        "Míst celkem": "category",  # 'Míst celkem',
        "Barva": "category",  # 'Barva',
        "Rozvor": "category",  # 'Rozvor',
        "Délka": np.float64,  # 'Délka',
        "Šířka": np.float64,  # 'Šířka',
        "Výška": np.float64,  # 'Výška',
        "Provozní hmotnost": np.float64,  # 'Provozní hmotnost',
        "Přípustná hmotnost": np.float64,  # 'Přípustná hmotnost',
        "Spojovací zařízení (SZ)": "object",  # 'Spojovací zařízení (SZ)',
        "Přípustná SZ brzděného": np.float64,  # 'Přípustná SZ brzděného',
        "Přípustná SZ nebrzděného": np.float64,  # 'Přípustná SZ nebrzděného',
        "Nápravy počet": np.float64,  # 'Nápravy počet',
        "Pneumatiky N1": "category",  # 'Pneumatiky N1',
        "Pneumatiky N1": "category",  # 'Pneumatiky N1',
        "Pneumatiky N3": "category",  # 'Pneumatiky N3',
        "Pneumatiky N4": "category",  # 'Pneumatiky N4',
        "Ráfky N1": "category",  # 'Ráfky N1',
        "Ráfky N1": "category",  # 'Ráfky N1',
        "Ráfky N3": "category",  # 'Ráfky N3',
        "Ráfky N4": "category",  # 'Ráfky N4',
        "Max. rychlost": np.float64,  # 'Max. rychlost',
        "Spotřeba průměrná": np.float64,  # 'Spotřeba průměrná',
        "Spotřeba město": np.float64,  # 'Spotřeba město',
        "Spotřeba mimo město": np.float64,  # 'Spotřeba mimo město',
        "Převodovka": "category",  # 'Převodovka',
        "Emise CO2": np.float64,  # 'Emise CO2',
        "Emise CO2/město": np.float64,  # 'Emise CO2/město',
        "Emise CO2/mimo město": np.float64,  # 'Emise CO2/mimo město',
        "Prohlídka status": "category",  # 'Prohlídka status',
    }

    if start > 1:
        df = pd.read_csv(
            filepath,
            usecols=cols,
            sep="|",
            dtype=dtype,
            true_values=["True"],
            false_values=["False"],
            na_values=["", "NEUVEDENO"],
            thousands=" ",
            decimal=",",
            encoding="cp1250",
            encoding_errors="ignore",
            skiprows=range(1, start),  # Keep the header.
            nrows=chunk_size,
        )
    else:
        df = pd.read_csv(
            filepath,
            usecols=cols,
            sep="|",
            dtype=dtype,
            true_values=["True"],
            false_values=["False"],
            na_values=["", "NEUVEDENO"],
            thousands=" ",
            decimal=",",
            encoding="cp1250",
            encoding_errors="ignore",
            nrows=chunk_size,
        )

    return df.rename(
        columns={
            "Rok výroby": "manufacture_year",
            "Stav": "operating_state",
            "1. registrace": "first_registration",
            "1. registrace ČR": "first_registration_cz",
            "Druh": "primary_type",
            "Druh 2. ř.": "secondary_type",
            "Kategorie": "category",
            "Tovární značka": "make",
            "Varianta název": "model_secondary",
            "Obchodní označení": "model_primary",
            "VIN": "vin",
            "Motor/Max. výkon": "motor_power",
            "Motor/Zdvihový objem": "motor_volume",
            "Palivo": "drive_type",
            "Míst celkem": "places",
            "Barva": "color",
            "Rozvor": "wheelbase_size",
            "Délka": "vehicle_length",
            "Šířka": "vehicle_width",
            "Výška": "vehicle_height",
            "Provozní hmotnost": "operating_weight",
            "Přípustná hmotnost": "permissible_weight",
            "Spojovací zařízení (SZ)": "connecting_device",
            "Přípustná SZ brzděného": "permissible_weight_braked_trailer",
            "Přípustná SZ nebrzděného": "permissible_weight_unbraked_trailer",
            "Nápravy počet": "axles_count",
            "Pneumatiky N1": "tyres_n1",
            "Pneumatiky N1": "tyres_n2",
            "Pneumatiky N3": "tyres_n3",
            "Pneumatiky N4": "tyres_n4",
            "Ráfky N1": "rims_n1",
            "Ráfky N1": "rims_n2",
            "Ráfky N3": "rims_n3",
            "Ráfky N4": "rims_n4",
            "Max. rychlost": "max_speed",
            "Spotřeba průměrná": "average_consumption",
            "Spotřeba město": "city_consumption",
            "Spotřeba mimo město": "out_of_city_consumption",
            "Převodovka": "gearbox",
            "Emise CO2": "emissions",
            "Emise CO2/město": "city_emissions",
            "Emise CO2/mimo město": "out_of_city_emissions",
            "Prohlídka status": "inspection_state",
        }
    )
