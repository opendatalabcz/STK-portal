import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import ModelPopularityBrowser from "./ModelPopularityBrowser";
import SelectedMakesPopularityChart from "./SelectedModelsPopularityBrowser";

export default function MakePopularityPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Popularita modelů" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <ModelPopularityBrowser></ModelPopularityBrowser>
          <SelectedMakesPopularityChart></SelectedMakesPopularityChart>

          <p>
            Ve vývoji počtu nových registrací jsou vybrané nejčastější kombinace
            značka + model. Export registru vozidel, na kterém je statistika
            založená, obsahuje explicitní názvy pouze 150 nejčastějších značek a
            modelů, kvůli čemuž není možné zobrazit vývoj počtu velmi raritních
            modelů.
          </p>

          <p>
            Export registru vozidel navíc obsahuje zajímavé chyby, jejichž
            existenci lze ověřit i na webu provozovaném Ministerstvem dopravy ČR{" "}
            <a href="https://www.dataovozidlech.cz/">Datová kostka</a>. Jedná se
            v kontextu této statistiky o špatně zadané názvy obchodního označení
            vozidla (tj. název modelu). Objevují se kombinace jako "AUDI FORMAN"
            (podle sekundárního názvu modelu se v jednom z případů má zřejmě
            jednat o AUDI RS6), "ŠKODA GOLF", "VW CITIGO" či "HYUNDAI CEED".
            Většinou jde o jednotky, maximálně desítky záznamů s takovou
            kombinací.
          </p>
        </div>
      </Container>
    </>
  );
}
