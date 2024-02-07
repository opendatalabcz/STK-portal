import SearchBox from "./SearchBox";
import AverageAgeChart from "./changes-in-time/AverageAgeChart";
import Container from "@/components/Container";
import ColorsChart from "./changes-in-time/ColorsChart";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import { Breadcrumb } from "antd";
import Link from "next/link";
import DriveTypeChart from "./changes-in-time/drive-type/DriveTypeChart";
import ElectricDriveTypeChart from "./changes-in-time/ElectricDriveTypeChart";

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

        <h1 className="pt-8 text-3xl">Statistiky</h1>

        <h2 className="pt-4 text-2xl">Proměny vozového parku v čase</h2>
        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
          <AverageAgeChart linkToDetails></AverageAgeChart>
          <ColorsChart linkToDetails></ColorsChart>
          <DriveTypeChart linkToDetails></DriveTypeChart>
          <ElectricDriveTypeChart linkToDetails></ElectricDriveTypeChart>
        </div>
      </Container>
    </>
  );
}
