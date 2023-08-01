import pandas as pd


def transform_inspection_type(df: pd.DataFrame, **kwargs) -> pd.DataFrame:
    # Should be already inferred, do this just to be sure.
    df['inspection_type'] = df['inspection_type'].astype('category')
    
    df['inspection_type'] = df['inspection_type'].cat.rename_categories({
        'pravidelná': 'regular',
        'Evidenční kontrola': 'evidence',
        'Před registrací': 'before_registration',
        'opakovaná': 'repeated',
        'Na žádost zákazníka': 'on_demand',
        'Před registrací - opakovaná': 'before_registration_repeated',
        'ADR': 'adr',
        'Před schvál. tech. způsob. vozidla': 'before_acceptance',
        'Nařízená technická prohlídka': 'ordered',
        'TSK - Opakovaná': 'road_repeated',
        'Technická silniční kontrola': 'road',
        'TSK - Opakovaná po DN': 'road_repeated_after_dn',
        'Před schvál. tech. způsob. vozidla - opakovaná': 'before_acceptance_repeated',
        'ADR - opakovaná': 'adr_repeated',
    })

    return df