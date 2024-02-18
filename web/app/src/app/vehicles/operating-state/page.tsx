import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import OperatingStateChart from "./OperatingStateChart";

export default async function DriveTypePage() {
  const data: Vehicle[] = await (
    await fetch(
      `${process.env.api}/vehicles?order=first_registration_cz.desc&limit=1`
    )
  ).json();

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
            v ČR platný k datu získání exportu registru vozidel, tj.{" "}
            {
              //@ts-ignore
              new Date(data[0].first_registration).toLocaleDateString("cs-CZ")
            }
            . Datum první registrace často neodpovídá stáří vozidla &ndash;
            zejména ojetá importovaná vozidla budou zpravidla mnohem starší, než
            je jejich datum první registrace v ČR. Graf ale poskytuje náhled
            toho, jak dlouho vozidlo průměrně v České republice "prežije".
          </p>
        </div>
      </Container>
    </>
  );
}
