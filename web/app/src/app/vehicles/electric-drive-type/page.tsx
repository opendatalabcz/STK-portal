import Breadcrumb from "antd/es/breadcrumb";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import ElectricDriveTypeChart from "./ElectricDriveTypeChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elektrifikace nově registrovaných vozidel - STK Portál",
};

export default function DriveTypePage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Elektrifikace nově registrovaných vozidel" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <ElectricDriveTypeChart></ElectricDriveTypeChart>

          <p>
            Graf ukazuje celkový počet vozidel nově registrovaných v ČR v každém
            roce, rozdělený podle jednotlivých typů elektrifikace. Data získaná
            z registru vozidel bohužel neobsahují rozslišení mezi hybridem a
            plug-in hybridem, takže je k dispozici pouze rozdělení na čistě
            elektrická a nějakým způsobem hybridní vozidla. Srovnání
            elektrifikovaných vozidel s celkovým počtem nově registrovaných je k
            dispozici <a href="/vehicles/drive-type">zde</a>.
          </p>

          <p>
            Skutečný údaj v technickém průkazu může být složitější, vozidla jsou
            proto seskupena do jednodušších kategorií:
          </p>

          <ul className="py-2 pl-6 list-disc">
            <li>Elektropohon: bez spalovacího motoru</li>
            <li>
              Benzin hybrid: elektropohon v kombinaci s benzinovým či případně
              také LPG pohonem
            </li>
            <li>Nafta hybrid: elektropohon v kombinaci s dieselovým pohonem</li>
          </ul>
        </div>
      </Container>
    </>
  );
}
