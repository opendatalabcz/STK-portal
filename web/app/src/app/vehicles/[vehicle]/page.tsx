"use client";

import { Breadcrumb, Card, Spin } from "antd";
import {
  CarOutlined,
  NumberOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import useSWR from "swr";
import { useState } from "react";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import Container from "@/components/Container";
import InspectionsTable from "./InspectionsTable";
import DefectPredictionTable from "./DefectPredictionTable";
import MileageChart from "./MileageChart";
import VehicleDetailsCard from "./VehicleDetailsCard";
import SearchBox from "../SearchBox";

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

  if (vehicleData) {
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
          {buildVehicleDataDetails(vehicleData)}

          <h2 className="pt-4 text-2xl">Prohlídky</h2>
          <hr className="pb-4"></hr>

          <InspectionsTable vin={vehicle}></InspectionsTable>

          <h1 className="pt-8 text-3xl">Statistiky</h1>
          <h2 className="pt-4 text-2xl">Predikce závad</h2>
          <hr className="pb-4"></hr>

          <p className="pb-4">
            Tabulka zobrazuje pravděpodobnost, že vozidlo na příští prohlídce
            bude mít v dané kategorii nějakou závadu.
          </p>

          <DefectPredictionTable vehicle={vehicle}></DefectPredictionTable>

          <h2 className="pt-4 text-2xl">Predikce nájezdu</h2>
          <hr className="pb-4"></hr>

          <MileageChart vehicle={vehicle}></MileageChart>
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
        <SearchBox></SearchBox>
        <Link href={"/vehicles"} className="text-primary">
          Zpět na přehled vozidel
        </Link>
      </div>
    );
  }

  function buildVehicleDataDetails(vehicleData: Vehicle) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <NumberOutlined className="mt-1" title="VIN" />
            <div>
              <p>
                {/* <span className="font-bold">VIN:&nbsp;</span> */}
                <span className="font-mono">{vehicleData.vin}</span>
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CarOutlined className="mt-1" title="Kategorie vozidla" />
            <div>
              <p>
                {<span className="font-bold">{vehicleData.category}</span> ?? (
                  <span className="font-bold text-gray-500">
                    Chybí kategorie
                  </span>
                )}
                {vehicleData.primary_type && <span>&nbsp;&ndash;&nbsp;</span>}
                {vehicleData.primary_type}
                {vehicleData.primary_type && vehicleData.secondary_type && ", "}
                {vehicleData.secondary_type}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CalendarOutlined className="mt-1" />
            <table className="table-auto">
              <tbody>
                <tr>
                  <td className="pr-2 font-bold">První registrace</td>
                  <td className="px-2">
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
                  <td className="pr-2 font-bold">První registrace v ČR</td>
                  <td className="px-2">
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
                  <td className="pr-2 font-bold">Rok výroby</td>
                  <td className="px-2">
                    {vehicleData.manufacture_year ?? (
                      <span className="text-gray-500">&mdash;</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <VehicleDetailsCard vehicleData={vehicleData}></VehicleDetailsCard>
      </div>
    );
  }
}
