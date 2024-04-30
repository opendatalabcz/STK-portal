import Breadcrumb from "antd/es/breadcrumb";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import OperatingStateChart from "./OperatingStateChart";

export default function DriveTypePage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Status vozidel" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <OperatingStateChart></OperatingStateChart>

          <p>
            Graf popisuje podíl stavů vozidel podle jejich data první registrace
            v ČR platný k datu získání exportu registru vozidel. Datum první
            registrace často neodpovídá stáří vozidla &ndash; zejména ojetá
            importovaná vozidla budou zpravidla mnohem starší, než je jejich
            datum první registrace v ČR. Graf ale poskytuje náhled toho, jak
            dlouho vozidlo průměrně v České republice &quot;přežije&quot;.
          </p>
        </div>
      </Container>
    </>
  );
}
