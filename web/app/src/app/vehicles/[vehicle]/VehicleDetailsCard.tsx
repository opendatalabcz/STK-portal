import { Card } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { latestYear } from "@/years";

interface IStringMap {
  [index: string]: string;
}

export default function VehicleDetailsCard({
  vehicleData,
}: {
  vehicleData: Vehicle;
}) {
  const [displayMore, setDisplayMore] = useState(false);

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

  const tyres = [];
  if (vehicleData.tyres_n1 != null) tyres.push(vehicleData.tyres_n1);
  if (vehicleData.tyres_n2 != null) tyres.push(vehicleData.tyres_n2);
  if (vehicleData.tyres_n3 != null) tyres.push(vehicleData.tyres_n3);
  if (vehicleData.tyres_n4 != null) tyres.push(vehicleData.tyres_n4);

  const rims = [];
  if (vehicleData.rims_n1 != null) rims.push(vehicleData.rims_n1);
  if (vehicleData.rims_n2 != null) rims.push(vehicleData.rims_n2);
  if (vehicleData.rims_n3 != null) rims.push(vehicleData.rims_n3);
  if (vehicleData.rims_n4 != null) rims.push(vehicleData.rims_n4);

  return (
    <Card
      size="small"
      title={
        <div className="space-x-2">
          <InfoCircleOutlined
            className="mt-1"
            title="Informace z registru vozidel"
          />
          <span>Technické informace ({latestYear})</span>
        </div>
      }
    >
      <div className="flex items-start space-x-2">
        <table className="table-auto">
          <tbody>
            <tr>
              <td className="pr-2 font-bold">Stav prohlídky</td>
              <td className="px-2">{vehicleData.inspection_state}</td>
            </tr>
            <tr>
              <td className="pb-2 pr-2 font-bold">Stav vozidla</td>
              <td className="px-2 pb-2 ">{vehicleData.operating_state}</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="pt-2 pr-2 font-bold">Pohon</td>
              <td className="px-2 pt-2">
                {vehicleData.drive_type}
                {vehicleData.motor_volume &&
                  ", " + vehicleData.motor_volume / 1000 + " l"}
                {(vehicleData.drive_type || vehicleData.motor_volume) &&
                  vehicleData.motor_power &&
                  ", "}
                {vehicleData.motor_power && vehicleData.motor_power + " kW"}
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-2 font-bold">Převodovka</td>
              <td className="px-2 pb-2">
                {vehicleData.gearbox != null ? (
                  vehicleData.gearbox.toLowerCase()
                ) : (
                  <span className="text-gray-500">&mdash;</span>
                )}
              </td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="pt-2 pb-2 pr-2 font-bold">Barva</td>
              <td className="px-2 pt-2 pb-2">
                {vehicleData.color != null ? (
                  <span
                    style={{
                      color: colorMap[vehicleData.color ?? "ČERNÁ"],
                    }}
                  >
                    {vehicleData.color.toLowerCase()}
                  </span>
                ) : (
                  <span className="text-gray-500">&mdash;</span>
                )}
              </td>
            </tr>
            {!displayMore ? (
              <tr
                onClick={() => setDisplayMore(!displayMore)}
                className="hover:cursor-pointer"
              >
                <td className="font-bold text-gray-500 hover:text-primary">
                  Zobrazit vše&#8230;
                </td>
              </tr>
            ) : (
              <>
                <tr className="border-t border-gray-200">
                  <td className="pt-2 pb-2 pr-2 font-bold">Počet míst</td>
                  <td className="px-2 pt-2 pb-2">
                    {vehicleData.places != null ? (
                      vehicleData.places
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="pt-2 pr-2 font-bold">Rozvor</td>
                  <td className="px-2 pt-2">
                    {vehicleData.wheelbase_size != null ? (
                      vehicleData.wheelbase_size + " mm"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pb-2 pr-2 font-bold">Rozměry (d, š, v)</td>
                  <td className="px-2 pb-2">
                    {vehicleData.vehicle_length != null ? (
                      vehicleData.vehicle_length
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                    ,{" "}
                    {vehicleData.vehicle_width != null ? (
                      vehicleData.vehicle_width
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                    ,{" "}
                    {vehicleData.vehicle_height != null ? (
                      vehicleData.vehicle_height
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}{" "}
                    mm
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="pt-2 pr-2 font-bold">Provozní hmotnost</td>
                  <td className="px-2 pt-2">
                    {vehicleData.operating_weight != null ? (
                      vehicleData.operating_weight + " kg"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pb-2 pr-2 font-bold">Přípustná hmotnost</td>
                  <td className="px-2 pb-2">
                    {vehicleData.permissible_weight != null ? (
                      vehicleData.permissible_weight + " kg"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="pt-2 pr-2 font-bold">
                    Spojovací zařízení (SZ)
                  </td>
                  <td className="px-2 pt-2">
                    {vehicleData.connecting_device != null ? (
                      vehicleData.connecting_device
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pr-2 font-bold">Přípustná hm. brzděného</td>
                  <td className="px-2">
                    {vehicleData.permissible_weight_braked_trailer != null ? (
                      vehicleData.permissible_weight_braked_trailer + " kg"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pb-2 pr-2 font-bold">
                    Přípustná hm. nebrzděného
                  </td>
                  <td className="px-2 pb-2 ">
                    {vehicleData.permissible_weight_unbraked_trailer != null ? (
                      vehicleData.permissible_weight_unbraked_trailer + " kg"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="pt-2 pr-2 font-bold">Počet náprav</td>
                  <td className="px-2 pt-2">
                    {vehicleData.axles_count ?? (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pr-2 font-bold">Pneumatiky</td>
                  <td className="px-2">
                    {tyres.length > 0 ? (
                      tyres[0]
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                {tyres.slice(1).map((t, i) => (
                  <tr key={i}>
                    <td className="pr-2"></td>
                    <td className="px-2">{t}</td>
                  </tr>
                ))}
                <tr>
                  <td className="pb-2 pr-2 font-bold">Ráfky</td>
                  <td className="px-2 pb-2">
                    {rims.length > 0 ? (
                      rims[0]
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                {rims.slice(1).map((t, i) => (
                  <tr key={i}>
                    <td className="pr-2"></td>
                    <td className="px-2">{t}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-200">
                  <td className="pt-2 pb-2 pr-2 font-bold">Max. rychlost</td>
                  <td className="px-2 pt-2 pb-2">
                    {vehicleData.max_speed != null ? (
                      vehicleData.max_speed + " km/h"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="pt-2 pr-2 font-bold">Spotřeba průměrná</td>
                  <td className="px-2 pt-2">
                    {vehicleData.average_consumption != null ? (
                      vehicleData.average_consumption + " l/100 km"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pr-2 font-bold">&ndash; město</td>
                  <td className="px-2">
                    {vehicleData.city_consumption != null ? (
                      vehicleData.city_consumption + " l/100 km"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pb-2 pr-2 font-bold">&ndash; mimo město</td>
                  <td className="px-2 pb-2">
                    {vehicleData.out_of_city_consumption != null ? (
                      vehicleData.out_of_city_consumption + " l/100 km"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="pt-2 pr-2 font-bold">
                    Emise CO<sub>2</sub>
                  </td>
                  <td className="px-2 pt-2">
                    {vehicleData.emissions != null ? (
                      vehicleData.emissions + " g/100 km"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pr-2 font-bold">&ndash; město</td>
                  <td className="px-2">
                    {vehicleData.city_emissions != null ? (
                      vehicleData.city_emissions + " g/100 km"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="pr-2 font-bold">&ndash; mimo město</td>
                  <td className="px-2">
                    {vehicleData.out_of_city_emissions != null ? (
                      vehicleData.out_of_city_emissions + " g/100 km"
                    ) : (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
                <tr
                  onClick={() => setDisplayMore(!displayMore)}
                  className="hover:cursor-pointer"
                >
                  <td className="font-bold text-gray-500 hover:text-primary">
                    Zobrazit méně&#8230;
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
