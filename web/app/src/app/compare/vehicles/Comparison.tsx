import DefectPredictionTable from "@/app/vehicles/[vehicle]/DefectPredictionTable";
import InspectionsTable from "@/app/vehicles/[vehicle]/InspectionsTable";
import { latestYear } from "@/years";
import {
  CarOutlined,
  NumberOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import useSWR from "swr";
import DoubleDefectPredictionTable from "./DoubleDefectPredictionTable";
import DoubleMileageChart from "./DoubleMileageChart";
import InspectionsOnFrequentDaysTable from "@/app/vehicles/[vehicle]/InspectionsOnFrequentDaysTable";

export default function Comparison({
  firstVin,
  secondVin,
}: {
  firstVin: string;
  secondVin: string;
}) {
  const { data: firstData, isLoading: isFirstLoading } = useSWR(
    `/api/vehicles?vin=eq.${firstVin}`,
    async (key) => {
      const res = await fetch(key);
      const data: Vehicle[] = await res.json();
      return data[0];
    }
  );

  const { data: secondData, isLoading: isSecondLoading } = useSWR(
    `/api/vehicles?vin=eq.${secondVin}`,
    async (key) => {
      const res = await fetch(key);
      const data: Vehicle[] = await res.json();
      return data[0];
    }
  );

  if (firstData && secondData) {
    interface IStringMap {
      [index: string]: string;
    }

    const colorMap = {
      ORANŽOVÁ: "orange",
      ŠEDÁ: "grey",
      ŽLUTÁ: "yellow",
      MODRÁ: "blue",
      ČERNÁ: "black",
      ZELENÁ: "green",
      BÍLÁ: "black",
      ČERVENÁ: "red",
      FIALOVÁ: "purple",
      HNĚDÁ: "brown",
    } as IStringMap;

    const firstTyres = [];
    if (firstData.tyres_n1 != null) firstTyres.push(firstData.tyres_n1);
    if (firstData.tyres_n2 != null) firstTyres.push(firstData.tyres_n2);
    if (firstData.tyres_n3 != null) firstTyres.push(firstData.tyres_n3);
    if (firstData.tyres_n4 != null) firstTyres.push(firstData.tyres_n4);

    const firstRims = [];
    if (firstData.rims_n1 != null) firstRims.push(firstData.rims_n1);
    if (firstData.rims_n2 != null) firstRims.push(firstData.rims_n2);
    if (firstData.rims_n3 != null) firstRims.push(firstData.rims_n3);
    if (firstData.rims_n4 != null) firstRims.push(firstData.rims_n4);

    const secondTyres = [];
    if (secondData.tyres_n1 != null) secondTyres.push(secondData.tyres_n1);
    if (secondData.tyres_n2 != null) secondTyres.push(secondData.tyres_n2);
    if (secondData.tyres_n3 != null) secondTyres.push(secondData.tyres_n3);
    if (secondData.tyres_n4 != null) secondTyres.push(secondData.tyres_n4);

    const secondRims = [];
    if (secondData.rims_n1 != null) secondRims.push(secondData.rims_n1);
    if (secondData.rims_n2 != null) secondRims.push(secondData.rims_n2);
    if (secondData.rims_n3 != null) secondRims.push(secondData.rims_n3);
    if (secondData.rims_n4 != null) secondRims.push(secondData.rims_n4);

    return (
      <>
        <h2 className="pt-8 text-2xl">Základní informace</h2>
        <hr></hr>

        <div className="grid grid-cols-5 gap-4 pt-4 min-w-[35rem] overflow-x-auto">
          <div></div>
          <span className="col-span-2 text-2xl">
            {firstData.make ?? "Neznámý výrobce,"}{" "}
            {firstData.model_primary ?? "Neznámý model"}{" "}
            {firstData.model_primary && firstData.model_secondary && (
              <span className="text-xl">{firstData.model_secondary}</span>
            )}
          </span>
          <span className="col-span-2 text-2xl">
            {secondData.make ?? "Neznámý výrobce,"}{" "}
            {secondData.model_primary ?? "Neznámý model"}{" "}
            {secondData.model_primary && secondData.model_secondary && (
              <span className="text-xl">{secondData.model_secondary}</span>
            )}
          </span>

          <span className="font-bold">Kategorie vozidla</span>
          <div className="col-span-2">
            <p>
              {<span className="font-bold">{firstData.category}</span> ?? (
                <span className="font-bold text-gray-500">Chybí kategorie</span>
              )}
              {firstData.primary_type && <span>&nbsp;&ndash;&nbsp;</span>}
              {firstData.primary_type}
              {firstData.primary_type && firstData.secondary_type && ", "}
              {firstData.secondary_type}
            </p>
          </div>
          <div className="col-span-2">
            <p>
              {<span className="font-bold">{secondData.category}</span> ?? (
                <span className="font-bold text-gray-500">Chybí kategorie</span>
              )}
              {secondData.primary_type && <span>&nbsp;&ndash;&nbsp;</span>}
              {secondData.primary_type}
              {secondData.primary_type && secondData.secondary_type && ", "}
              {secondData.secondary_type}
            </p>
          </div>

          <span className="font-bold">První registrace</span>
          <span className="col-span-2">
            {firstData.first_registration != null ? (
              new Date(firstData.first_registration).toLocaleDateString("cs-CZ")
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </span>
          <span className="col-span-2">
            {secondData.first_registration != null ? (
              new Date(secondData.first_registration).toLocaleDateString(
                "cs-CZ"
              )
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </span>

          <span className="font-bold">První registrace v ČR</span>
          <span className="col-span-2">
            {firstData.first_registration_cz != null ? (
              new Date(firstData.first_registration_cz).toLocaleDateString(
                "cs-CZ"
              )
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </span>
          <span className="col-span-2">
            {secondData.first_registration_cz != null ? (
              new Date(secondData.first_registration_cz).toLocaleDateString(
                "cs-CZ"
              )
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </span>

          <span className="font-bold">Rok výroby</span>
          <span className="col-span-2">
            {firstData.manufacture_year ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </span>
          <span className="col-span-2">
            {secondData.manufacture_year ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </span>

          <span className="font-bold">
            Vozidlo je nejspíš importované ojeté
          </span>
          <span className="col-span-2">
            {
              // @ts-ignore
              (new Date(firstData.first_registration_cz) -
                // @ts-ignore
                new Date(firstData.first_registration)) /
                (1000 * 3600 * 24) >
              365
                ? "Ano"
                : "Ne"
            }
          </span>
          <span className="col-span-2">
            {
              // @ts-ignore
              (new Date(secondData.first_registration_cz) -
                // @ts-ignore
                new Date(secondData.first_registration)) /
                (1000 * 3600 * 24) >
              365
                ? "Ano"
                : "Ne"
            }
          </span>
        </div>

        <h2 className="pt-6 text-2xl">Technické detaily ({latestYear})</h2>
        <hr></hr>
        <div className="grid grid-cols-5 gap-4 pt-4 min-w-[35rem] overflow-x-auto">
          <span className="font-bold">Stav prohlídky</span>
          <div className="col-span-2">{firstData.inspection_state}</div>
          <div className="col-span-2">{secondData.inspection_state}</div>

          <span className="font-bold">Stav vozidla</span>
          <div className="col-span-2">{firstData.operating_state}</div>
          <div className="col-span-2">{secondData.operating_state}</div>

          <span className="font-bold">Palivo</span>
          <div className="col-span-2">{firstData.drive_type}</div>
          <div className="col-span-2">{secondData.drive_type}</div>

          <hr className="col-span-5"></hr>

          <span className="font-bold">Objem motoru [l]</span>
          <div className="col-span-2">
            {firstData.motor_volume != null ? (
              firstData.motor_volume / 1000
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.motor_volume != null ? (
              secondData.motor_volume / 1000
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Výkon motoru [kW]</span>
          <div className="col-span-2">
            {firstData.motor_power ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.motor_power ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Převodovka</span>
          <div className="col-span-2">
            {firstData.gearbox != null ? (
              firstData.gearbox.toLowerCase()
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.gearbox != null ? (
              secondData.gearbox.toLowerCase()
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <hr className="col-span-5"></hr>

          <span className="font-bold">Barva</span>
          <div className="col-span-2">
            {firstData.color != null ? (
              <span
                style={{
                  color: colorMap[firstData.color ?? "ČERNÁ"],
                }}
              >
                {firstData.color.toLowerCase()}
              </span>
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.color != null ? (
              <span
                style={{
                  color: colorMap[secondData.color ?? "ČERNÁ"],
                }}
              >
                {secondData.color.toLowerCase()}
              </span>
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Počet míst</span>
          <div className="col-span-2">
            {firstData.places ?? <span className="text-gray-500">&mdash;</span>}
          </div>
          <div className="col-span-2">
            {secondData.places ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Rozvor [mm]</span>
          <div className="col-span-2">
            {firstData.wheelbase_size ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.wheelbase_size ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">
            Rozměry (d &times; š &times; v) [mm]
          </span>
          <div className="col-span-2">
            {firstData.vehicle_length ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
            &nbsp;&times;&nbsp;
            {firstData.vehicle_width ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
            &nbsp;&times;&nbsp;
            {firstData.vehicle_height ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.vehicle_length ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
            &nbsp;&times;&nbsp;
            {secondData.vehicle_width ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
            &nbsp;&times;&nbsp;
            {secondData.vehicle_height ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <hr className="col-span-5"></hr>

          <span className="font-bold">Provozní hmotnost [kg]</span>
          <div className="col-span-2">
            {firstData.operating_weight ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.operating_weight ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Přípustná hmotnost [kg]</span>
          <div className="col-span-2">
            {firstData.permissible_weight ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.permissible_weight ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Spojovací zařízení (SZ)</span>
          <div className="col-span-2">
            {firstData.connecting_device != null ? (
              firstData.connecting_device
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.connecting_device != null ? (
              secondData.connecting_device
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Přípustná hm. brzděného [kg]</span>
          <div className="col-span-2">
            {firstData.permissible_weight_braked_trailer ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.permissible_weight_braked_trailer ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Přípustná hm. nebrzděného [kg]</span>
          <div className="col-span-2">
            {firstData.permissible_weight_unbraked_trailer ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.permissible_weight_unbraked_trailer ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <hr className="col-span-5"></hr>

          <span className="font-bold">Počet náprav</span>
          <div className="col-span-2">
            {firstData.axles_count ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.axles_count ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Pneumatiky</span>
          <div className="flex flex-col col-span-2 space-y-2">
            {firstTyres.length > 0 ? (
              firstTyres[0]
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
            {firstTyres.slice(1).map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
          <div className="flex flex-col col-span-2 space-y-2">
            {secondTyres.length > 0 ? (
              secondTyres[0]
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
            {secondTyres.slice(1).map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>

          <span className="font-bold">Ráfky</span>
          <div className="flex flex-col col-span-2 space-y-2">
            {firstRims.length > 0 ? (
              firstRims[0]
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
            {firstRims.slice(1).map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
          <div className="flex flex-col col-span-2 space-y-2">
            {secondRims.length > 0 ? (
              secondRims[0]
            ) : (
              <span className="text-gray-500">&mdash;</span>
            )}
            {secondRims.slice(1).map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>

          <hr className="col-span-5"></hr>

          <span className="font-bold">Max. rychlost</span>
          <div className="col-span-2">
            {firstData.max_speed ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.max_speed ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">Spotřeba průměrná [l/100 km]</span>
          <div className="col-span-2">
            {firstData.average_consumption ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.average_consumption ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">&ndash; město</span>
          <div className="col-span-2">
            {firstData.city_consumption ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.city_consumption ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">&ndash; mimo město</span>
          <div className="col-span-2">
            {firstData.out_of_city_consumption ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.out_of_city_consumption ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">
            Emise CO<sub>2</sub> [g/100 km]
          </span>
          <div className="col-span-2">
            {firstData.emissions ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.emissions ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">&ndash; město</span>
          <div className="col-span-2">
            {firstData.city_emissions ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.city_emissions ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>

          <span className="font-bold">&ndash; mimo město</span>
          <div className="col-span-2">
            {firstData.out_of_city_emissions ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
          <div className="col-span-2">
            {secondData.out_of_city_emissions ?? (
              <span className="text-gray-500">&mdash;</span>
            )}
          </div>
        </div>

        <h2 className="pt-6 text-2xl">Prohlídky</h2>
        <hr></hr>
        <div className="flex flex-col space-y-4">
          <h3 className="pt-4 text-xl">
            {firstData.make ?? "Neznámý výrobce,"}{" "}
            {firstData.model_primary ?? "Neznámý model"} ({firstVin})
          </h3>
          <InspectionsTable vin={firstVin}></InspectionsTable>
          <h3 className="text-xl">
            {secondData.make ?? "Neznámý výrobce,"}{" "}
            {secondData.model_primary ?? "Neznámý model"} ({secondVin})
          </h3>
          <InspectionsTable vin={secondVin}></InspectionsTable>
        </div>

        <h2 className="pt-6 text-2xl">Predikce závad</h2>
        <hr></hr>
        <div className="flex flex-col pt-4 space-y-4">
          <p>
            Tabulka zobrazuje pravděpodobnost, že vozidlo na příští prohlídce
            bude mít v dané kategorii nějakou závadu.
          </p>
          <DoubleDefectPredictionTable
            firstVin={firstVin}
            firstVehicleName={
              (firstData.make ?? "Neznámý výrobce, ") +
              " " +
              (firstData.model_primary ?? "Neznámý model")
            }
            secondVin={secondVin}
            secondVehicleName={
              (secondData.make ?? "Neznámý výrobce,") +
              " " +
              (secondData.model_primary ?? "Neznámý model")
            }
          ></DoubleDefectPredictionTable>
        </div>

        <h2 className="pt-6 text-2xl">Historie a predikce nájezdu</h2>
        <hr></hr>
        <p className="pt-4">
          Graf srovnává historii nájezdů obou vozidel. Poslední bod (zvýrazněný
          tmavší barvou) je predikce založená na poslední známé pravidelné
          kontrole. Křivka chybí, pokud nejsou k dispozici žádné pravidelné
          kontroly vozu.
        </p>
        <div className="pt-4">
          <DoubleMileageChart
            firstVin={firstVin}
            firstVehicleName={
              (firstData.make ?? "Neznámý výrobce, ") +
              " " +
              (firstData.model_primary ?? "Neznámý model")
            }
            secondVin={secondVin}
            secondVehicleName={
              (secondData.make ?? "Neznámý výrobce,") +
              " " +
              (secondData.model_primary ?? "Neznámý model")
            }
          ></DoubleMileageChart>
        </div>

        <h2 className="pt-6 text-2xl">
          Prohlídky v neobvykle frekventovaných dnech
        </h2>
        <hr></hr>
        <div className="flex flex-col pt-4 space-y-4">
          <p>
            Tabulka obsahuje výčet prohlídek, které byly prováděny v den, kdy na
            dané stanici proběhlo výjimečně velké množství prohlídek vůči
            průměru. To může indikovat zvýšené nároky na personál a potenciální
            vliv na průběh prohlídky.
          </p>
          <p>
            Za výjimečně frekventovaný den se považuje takový, že počet
            provedených prohlídek je o dvě standardní odchylky vyšší než průměr
            daného měsíce. Tato hranice byla zvolena tak, aby bylo označeno
            pouze malé procento dní a tempo práce muselo tedy na stanici být
            nadstandardní. Do vzorku, z nichž je průměr a odchylka získána, se
            započítávají stejné měsíce ze všech let, za které jsou data o
            prohlídkách k dispozici. To umožňuje podchytit sezónní charakter
            vytíženosti stanic, kdy např. v lednu je obecně vytíženost menší než
            v květnu a podobně.
          </p>
          <h3 className="pt-4 text-xl">
            {firstData.make ?? "Neznámý výrobce,"}{" "}
            {firstData.model_primary ?? "Neznámý model"} ({firstVin})
          </h3>
          <InspectionsOnFrequentDaysTable
            vin={firstVin}
          ></InspectionsOnFrequentDaysTable>
          <h3 className="text-xl">
            {secondData.make ?? "Neznámý výrobce,"}{" "}
            {secondData.model_primary ?? "Neznámý model"} ({secondVin})
          </h3>
          <InspectionsOnFrequentDaysTable
            vin={secondVin}
          ></InspectionsOnFrequentDaysTable>
        </div>
      </>
    );
  } else if (isFirstLoading || isSecondLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spin></Spin>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center py-24">
        Chyba načítání dat.
      </div>
    );
  }
}
