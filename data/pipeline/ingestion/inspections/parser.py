from xml.etree import ElementTree as ET
import pandas as pd


def parse(path):
    file = path

    # Remove newlines.
    clean = open(file, encoding='utf8').read().replace('\n', '')
    f = open(file, 'w', encoding='utf8')
    f.write(clean)
    f.close()

    station_id = []
    inspection_type = []
    vin = []
    date = []
    # make = []
    # motor_type = []
    vehicle_type = []
    # model = []
    # vehicle_class = []
    first_registration_date = []
    mileage = []
    defects = []
    result = []

    # Parse.
    parser = ET.iterparse(file)
    for _, element in parser:
        if element.tag == 'record':

            if 'STK' in element.attrib:
                station_id.append(element.attrib['STK'])
            elif 'CisP' in element.attrib:
                station_id.append(element.attrib['CisP'].split('-')[1])
            else:
                station_id.append('')

            if 'DrTP' in element.attrib:
                inspection_type.append(element.attrib['DrTP'])
            else:
                inspection_type.append('')

            if 'VIN' in element.attrib:
                vin.append(element.attrib['VIN'])
            else:
                vin.append('')

            if 'DatKont' in element.attrib:
                date.append(element.attrib['DatKont'])
            else:
                date.append('')

            # if 'TZn' in element.attrib:
            #     make.append(element.attrib['TZn'])
            # else:
            #     make.append('')

            # if 'TypMot' in element.attrib:
            #     motor_type.append(element.attrib['TypMot'])
            # else:
            #     motor_type.append('')

            if 'DrVoz' in element.attrib:
                vehicle_type.append(element.attrib['DrVoz'])
            else:
                vehicle_type.append('')

            # if 'ObchOznTyp' in element.attrib:
            #     model.append(element.attrib['ObchOznTyp'])
            # else:
            #     model.append('')

            # if 'Ct' in element.attrib:
            #     vehicle_class.append(element.attrib['Ct'])
            # else:
            #     vehicle_class.append('')

            if 'DatPrvReg' in element.attrib:
                first_registration_date.append(element.attrib['DatPrvReg'])
            else:
                first_registration_date.append('')

            if 'Km' in element.attrib:
                mileage.append(element.attrib['Km'])
            else:
                mileage.append('')

            if 'Zav' in element.attrib:
                defects.append(element.attrib['Zav'])
            else:
                defects.append('')

            if 'VyslSTK' in element.attrib:
                result.append(element.attrib['VyslSTK'])
            elif 'Vysl' in element.attrib:
                result.append(element.attrib['Vysl'])
            else:
                result.append('')

            element.clear()

    return pd.DataFrame({
            'station_id': station_id,
            'date': date,
            'vin': vin,
            'inspection_type': inspection_type,
            'result': result,
            'mileage': mileage,
            'defects': defects,
            # 'make': make,
            # 'motor_type': motor_type,
            'vehicle_type': vehicle_type,
            # 'model_primary': model,
            # 'vehicle_class': vehicle_class,
            'first_registration_date': first_registration_date,
        })