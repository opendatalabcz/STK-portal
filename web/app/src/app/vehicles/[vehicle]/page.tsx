"use client";

import { Breadcrumb, Spin } from "antd";
import {
  CarOutlined,
  NumberOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import useSWR from "swr";
import { useState } from "react";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import Container from "@/components/Container";
import InspectionsTable from "./InspectionsTable";

export default function StationDetailPage({
  params: { vehicle },
}: {
  params: { vehicle: string };
}) {
  const { data: vehicleData, isLoading: isVehicleLoading } = useSWR(
    `/api/vehicles?vin=eq.${vehicle}`,
    async (key) => {
      const res = await fetch(key);
      const data: Vehicle[] = await res.json();
      return data[0];
    }
  );

  const [displayMore, setDisplayMore] = useState(false);

  if (vehicleData) {
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
      <>
        <BreadcrumbsContainer>
          <Breadcrumb
            items={[
              { title: <Link href="/">STK portál</Link> },
              { title: <Link href="/vehicles">Vozidla</Link> },
              { title: vehicleData.vin },
            ]}
          ></Breadcrumb>
        </BreadcrumbsContainer>

        <Container>
          <h1 className="pb-4 text-3xl">
            {vehicleData.make ?? "Neznámý výrobce,"}{" "}
            {vehicleData.model_primary ?? "Neznámý model"}{" "}
            {vehicleData.model_primary && vehicleData.model_secondary && (
              <span className="text-xl">{vehicleData.model_secondary}</span>
            )}
          </h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <NumberOutlined className="mt-1" title="VIN" />
                <div>
                  <p>
                    VIN:
                    <span className="px-1 font-mono ">{vehicleData.vin}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CarOutlined className="mt-1" title="Kategorie vozidla" />
                <div>
                  <p>
                    {vehicleData.category ?? (
                      <span className="text-gray-500">Chybí kategorie</span>
                    )}
                    {vehicleData.primary_type && " - "}
                    {vehicleData.primary_type}
                    {vehicleData.primary_type &&
                      vehicleData.secondary_type &&
                      ", "}
                    {vehicleData.secondary_type}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CalendarOutlined className="mt-1" />
                <table className="table-auto">
                  <tbody>
                    <tr>
                      <td>První registrace:&nbsp;</td>
                      <td>
                        {vehicleData.first_registration != null ? (
                          new Date(
                            vehicleData.first_registration
                          ).toLocaleDateString("cs-CZ")
                        ) : (
                          <span className="text-gray-500">&mdash;</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>První registrace v ČR:&nbsp;</td>
                      <td>
                        {vehicleData.first_registration_cz != null ? (
                          new Date(
                            vehicleData.first_registration_cz
                          ).toLocaleDateString("cs-CZ")
                        ) : (
                          <span className="text-gray-500">&mdash;</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Rok výroby:&nbsp;</td>
                      <td>
                        {vehicleData.manufacture_year ?? (
                          <span className="text-gray-500">&mdash;</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <InfoCircleOutlined
                className="mt-1"
                title="Informace z registru vozidel"
              />
              <table className="table-auto">
                <tbody>
                  <tr>
                    <td>Stav prohlídky:&nbsp;</td>
                    <td>{vehicleData.inspection_state}</td>
                  </tr>
                  <tr>
                    <td>Stav vozidla:&nbsp;</td>
                    <td>{vehicleData.operating_state}</td>
                  </tr>
                  <tr>
                    <td>Pohon:&nbsp;</td>
                    <td>
                      {vehicleData.drive_type}
                      {vehicleData.motor_volume &&
                        ", " + vehicleData.motor_volume / 1000 + " l"}
                      {(vehicleData.drive_type || vehicleData.motor_volume) &&
                        vehicleData.motor_power &&
                        ", "}
                      {vehicleData.motor_power &&
                        vehicleData.motor_power + " kW"}
                    </td>
                  </tr>
                  <tr>
                    <td>Převodovka:&nbsp;</td>
                    <td>
                      {vehicleData.gearbox != null ? (
                        vehicleData.gearbox.toLowerCase()
                      ) : (
                        <span className="text-gray-500">&mdash;</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Barva:&nbsp;</td>
                    <td>
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
                      <td className="italic text-gray-500 hover:text-primary">
                        Zobrazit vše...
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr>
                        <td>Počet míst:&nbsp;</td>
                        <td>
                          {vehicleData.places != null ? (
                            vehicleData.places
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Rozvor:&nbsp;</td>
                        <td>
                          {vehicleData.wheelbase_size != null ? (
                            vehicleData.wheelbase_size + " mm"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Rozměry (d, š, v):&nbsp;</td>
                        <td>
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
                      <tr>
                        <td>Provozní hmotnost:&nbsp;</td>
                        <td>
                          {vehicleData.operating_weight != null ? (
                            vehicleData.operating_weight + " kg"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Přípustná hmotnost:&nbsp;</td>
                        <td>
                          {vehicleData.permissible_weight != null ? (
                            vehicleData.permissible_weight + " kg"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Spojovací zařízení (SZ):&nbsp;</td>
                        <td>
                          {vehicleData.connecting_device != null ? (
                            vehicleData.connecting_device
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Přípustná SZ brzděného:&nbsp;</td>
                        <td>
                          {vehicleData.permissible_weight_braked_trailer !=
                          null ? (
                            vehicleData.permissible_weight_braked_trailer +
                            " kg"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Přípustná SZ nebrzděného:&nbsp;</td>
                        <td>
                          {vehicleData.permissible_weight_unbraked_trailer !=
                          null ? (
                            vehicleData.permissible_weight_unbraked_trailer +
                            " kg"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Počet náprav:&nbsp;</td>
                        <td>
                          {vehicleData.axles_count ?? (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Pneumatiky:&nbsp;</td>
                        <td>
                          {tyres.length > 0 ? (
                            tyres[0]
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      {tyres.slice(1).map((t, i) => (
                        <tr key={i}>
                          <td></td>
                          <td>{t}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>Ráfky:&nbsp;</td>
                        <td>
                          {rims.length > 0 ? (
                            rims[0]
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      {rims.slice(1).map((t, i) => (
                        <tr key={i}>
                          <td></td>
                          <td>{t}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>Max. rychlost:&nbsp;</td>
                        <td>
                          {vehicleData.max_speed != null ? (
                            vehicleData.max_speed + " km/h"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Spotřeba průměrná:&nbsp;</td>
                        <td>
                          {vehicleData.average_consumption != null ? (
                            vehicleData.average_consumption + " l/100 km"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Spotřeba město:&nbsp;</td>
                        <td>
                          {vehicleData.city_consumption != null ? (
                            vehicleData.city_consumption + " l/100 km"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Spotřeba mimo město:&nbsp;</td>
                        <td>
                          {vehicleData.out_of_city_consumption != null ? (
                            vehicleData.out_of_city_consumption + " l/100 km"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Emise CO<sub>2</sub>:&nbsp;
                        </td>
                        <td>
                          {vehicleData.emissions != null ? (
                            vehicleData.emissions + " g/100 km"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Emise CO<sub>2</sub> město:&nbsp;
                        </td>
                        <td>
                          {vehicleData.city_emissions != null ? (
                            vehicleData.city_emissions + " g/100 km"
                          ) : (
                            <span className="text-gray-500">&mdash;</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Emise CO<sub>2</sub> mimo město:&nbsp;
                        </td>
                        <td>
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
                        <td className="italic text-gray-500 hover:text-primary">
                          Zobrazit méně...
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            {/* <hr className="my-2"></hr> */}
            <h2 className="py-4 text-2xl">Prohlídky</h2>

            <InspectionsTable vin={vehicle}></InspectionsTable>
          </div>

          <h1 className="pt-4 text-3xl">Statistiky</h1>
        </Container>
      </>
    );
  } else if (isVehicleLoading) {
    return (
      <div className="flex items-center justify-center grow">
        <Spin></Spin>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 grow">
        <p>Vozidlo nebylo nalezeno</p>
        <Link href={"/vehicles"} className="text-primary">
          Zpět na přehled vozidel
        </Link>
      </div>
    );
  }
}
