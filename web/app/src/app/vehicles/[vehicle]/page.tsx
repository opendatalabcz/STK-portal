"use client";

import Link from "next/link";
import useSWR from "swr";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import Container from "@/components/Container";
import InspectionsTable from "./InspectionsTable";
import DefectPredictionTable from "./DefectPredictionTable";
import MileageChart from "./MileageChart";
import VehicleDetailsCard from "./VehicleDetailsCard";
import SearchBox from "../SearchBox";
import InspectionsOnFrequentDaysTable from "./InspectionsOnFrequentDaysTable";
import VehicleGeneralCard from "./VehicleGeneralCard";
import Breadcrumb from "antd/es/breadcrumb";
import Spin from "antd/es/spin";

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

          <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
            <VehicleGeneralCard vehicleData={vehicleData}></VehicleGeneralCard>
            <VehicleDetailsCard vehicleData={vehicleData}></VehicleDetailsCard>
          </div>

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

          <h2 className="pt-4 text-2xl">Historie a predikce nájezdu</h2>
          <hr className="pb-4"></hr>
          <MileageChart vehicle={vehicle}></MileageChart>

          <h2 className="pt-4 text-2xl">
            Prohlídky v neobvykle frekventovaných dnech
          </h2>
          <hr className="pb-4"></hr>
          <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
            <InspectionsOnFrequentDaysTable
              vin={vehicle}
            ></InspectionsOnFrequentDaysTable>
            <div className="space-y-4">
              <p>
                Tabulka obsahuje výčet prohlídek, které byly prováděny v den,
                kdy na dané stanici proběhlo výjimečně velké množství prohlídek
                vůči průměru. To může indikovat zvýšené nároky na personál a
                potenciální vliv na průběh prohlídky.
              </p>
              <p>
                Za výjimečně frekventovaný den se považuje takový, že počet
                provedených prohlídek je o dvě standardní odchylky vyšší než
                průměr daného měsíce. Tato hranice byla zvolena tak, aby bylo
                označeno pouze malé procento dní a tempo práce muselo tedy na
                stanici být nadstandardní. Do vzorku, z nichž je průměr a
                odchylka získána, se započítávají stejné měsíce ze všech let, za
                které jsou data o prohlídkách k dispozici. To umožňuje podchytit
                sezónní charakter vytíženosti stanic, kdy např. v lednu je
                obecně vytíženost menší než v květnu a podobně.
              </p>
            </div>
          </div>
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
}
