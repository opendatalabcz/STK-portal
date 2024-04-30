import Breadcrumb from "antd/es/breadcrumb";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import DriveTypeChart from "./DriveTypeChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typ pohonu nově registrovaných vozidel - STK Portál",
};

export default function DriveTypePage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Typ pohonu nově registrovaných vozidel" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <DriveTypeChart></DriveTypeChart>

          <p>
            Graf ukazuje celkový počet vozidel nově registrovaných v ČR v každém
            roce, rozdělený podle typu pohonu. Vidíme tedy změnu v popularitě
            pohonů u nových či importovaných ojetých vozidel v historii.
            Nepřekvapivě dominoval v devadesátých letech benzín, který se
            později rozdělil o tržní podíl s dieselovými motory. V posledních
            letech se objevují i elektrifikovaná vozidla, jejich detailnější
            rozdělení je dostupné{" "}
            <a href="/vehicles/electric-drive-type">zde</a>.
          </p>

          <p>
            Skutečný údaj v techickém průkazu může být mnohem složitější &ndash;
            v exportu registru vozidel je téměř 30 různých kombinací pohonů u
            jednotlivých vozidel. Vozidla jsou proto seskupena do jednodušších
            kategorií:
          </p>

          <ul className="py-2 pl-6 list-disc">
            <li>Benzin: pouze benzinový pohon</li>
            <li>Nafta: pohon na naftu nebo bio naftu</li>
            <li>
              Elektrifikované: obsahuje elektropohon, případně v kombinaci se
              spalovacím motorem (hybrid)
            </li>
            <li>
              Plyn (i v kombinaci): obsahuje plyn (LPG, CNG, LNG, vodík, metan),
              případně v kombinaci s jiným palivem, ale ne elektropohonem
              (taková vozidla by patřila mezi elektrifikovaná)
            </li>
            <li>Ostatní: např. vozidla spalující pouze etanol</li>
          </ul>
        </div>
      </Container>
    </>
  );
}
