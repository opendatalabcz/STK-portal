import SearchBox from "./SearchBox";
import Container from "@/components/Container";
import ColorsChart from "./colors/ColorsChart";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import { Breadcrumb } from "antd";
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
import ImportedVsNewChart from "./imported-vs-new/ImportedVsNewChart";

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

        <h1 className="pt-8 text-3xl">Souhrnné statistiky</h1>

        <h2 className="pt-4 text-2xl">Stáří a nájezd vozidel</h2>
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

        <h2 className="pt-8 text-2xl">Značky a modely</h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <TopMakesChart linkToDetails></TopMakesChart>
          <TopModelsChart linkToDetails></TopModelsChart>
        </div>

        <h2 className="pt-8 text-2xl">Alternativní pohony</h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <DriveTypeChart linkToDetails></DriveTypeChart>
          <ElectricDriveTypeChart linkToDetails></ElectricDriveTypeChart>
          <MileageByDriveTypeChart linkToDetails></MileageByDriveTypeChart>
        </div>

        <h2 className="pt-8 text-2xl">Import ojetých vozidel</h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <AverageAgeOfImportedChart linkToDetails></AverageAgeOfImportedChart>
          <ImportedVsNewChart linkToDetails></ImportedVsNewChart>
        </div>

        <h2 className="pt-4 text-2xl">Zajímavosti</h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <ColorsChart linkToDetails></ColorsChart>
          <OperatingStateChart linkToDetails></OperatingStateChart>
        </div>
      </Container>
    </>
  );
}
