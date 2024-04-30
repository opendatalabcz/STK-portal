import SearchBox from "./SearchBox";
import Container from "@/components/Container";
import ColorsChart from "./colors/ColorsChart";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import Link from "next/link";
import AverageAgeChart from "./average-age/AverageAgeChart";
import AverageAgeByDriveTypeChart from "./average-age-by-drive-type/AverageAgeByDriveTypeChart";
import RegionalAverageMileageChart from "./average-mileage-by-region/RegionalAverageMileageChart";
import DriveTypeChart from "./drive-type/DriveTypeChart";
import ElectricDriveTypeChart from "./electric-drive-type/ElectricDriveTypeChart";
import MileageByDriveTypeChart from "./mileage-by-drive-type/MileageByDriveTypeChart";
import TopMakesChart from "./make-popularity/TopMakesChart";
import TopModelsChart from "./model-popularity/TopModelsChart";
import OperatingStateChart from "./operating-state/OperatingStateChart";
import AverageMileageChart from "./average-mileage/AverageMileageChart";
import AverageAgeOfImportedChart from "./average-age-of-imported/AverageAgeOfImportedChart";
import ImportedVsNewRatioChart from "./imported-vs-new/ImportedVsNewRatioChart";
import { Metadata } from "next";
import Breadcrumb from "antd/es/breadcrumb";
import Card from "antd/es/card";

export const metadata: Metadata = {
  title: "Vozidla - STK Portál",
};

export default function VehiclesPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: "Vozidla" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <h1 className="pb-4 text-3xl">Vozidla</h1>

        <SearchBox></SearchBox>

        <h1 className="pt-8 pb-4 text-3xl">Souhrnné statistiky</h1>

        <Card size="small" title="Obsah">
          <ul className="pl-5 list-disc">
            <li>
              <a href="#age-and-mileage">Stáří a nájezd vozidel</a>
              <ul className="pl-6 list-disc ">
                <li>Průměrný věk osobních automobilů (OA)</li>
                <li>Průměrný věk OA podle typu pohonu</li>
                <li>Průměrný nájezd kontrolovaných OA</li>
                <li>Průměrný nájezd kontrolovaných OA podle kraje</li>
              </ul>
            </li>
            <li>
              <a href="#makes-and-models">Značky a modely</a>
              <ul className="pl-6 list-disc ">
                <li>Popularita značek</li>
                <li>Popularita modelů</li>
              </ul>
            </li>
            <li>
              <a href="#alternative-drive-types">Alternativní pohony</a>
              <ul className="pl-6 list-disc ">
                <li>Typ pohonu nově registrovaných vozidel</li>
                <li>Elektrifikace nově registrovaných vozidel</li>
                <li>Celkový nájezd podle typu pohonu</li>
              </ul>
            </li>
            <li>
              <a href="#import">Import ojetých vozidel</a>
              <ul className="pl-6 list-disc ">
                <li>Průměrné stáří ojetin při importu</li>
                <li>Poměr nových a importovaných ojetých OA</li>
              </ul>
            </li>
            <li>
              <a href="#misc">Zajímavosti</a>
              <ul className="pl-6 list-disc ">
                <li>Podíl barev nově registrovaných vozidel</li>
                <li>Status vozidel podle data registrace</li>
              </ul>
            </li>
          </ul>
        </Card>

        <h2 id="age-and-mileage" className="pt-4 text-2xl">
          Stáří a nájezd vozidel
        </h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <AverageAgeChart linkToDetails></AverageAgeChart>
          <AverageAgeByDriveTypeChart
            linkToDetails
          ></AverageAgeByDriveTypeChart>
          <AverageMileageChart linkToDetails></AverageMileageChart>
          <RegionalAverageMileageChart
            linkToDetails
          ></RegionalAverageMileageChart>
        </div>

        <h2 id="makes-and-models" className="pt-8 text-2xl">
          Značky a modely
        </h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <TopMakesChart linkToDetails></TopMakesChart>
          <TopModelsChart linkToDetails></TopModelsChart>
        </div>

        <h2 id="alternative-drive-types" className="pt-8 text-2xl">
          Alternativní pohony
        </h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <DriveTypeChart linkToDetails></DriveTypeChart>
          <ElectricDriveTypeChart linkToDetails></ElectricDriveTypeChart>
          <MileageByDriveTypeChart linkToDetails></MileageByDriveTypeChart>
        </div>

        <h2 id="import" className="pt-8 text-2xl">
          Import ojetých vozidel
        </h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <AverageAgeOfImportedChart linkToDetails></AverageAgeOfImportedChart>
          <ImportedVsNewRatioChart linkToDetails></ImportedVsNewRatioChart>
        </div>

        <h2 id="misc" className="pt-4 text-2xl">
          Zajímavosti
        </h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <ColorsChart linkToDetails></ColorsChart>
          <OperatingStateChart linkToDetails></OperatingStateChart>
        </div>
      </Container>
    </>
  );
}
