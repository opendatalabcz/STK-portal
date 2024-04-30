import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import AnomalousInspectionsChart from "./AnomalousInspectionsChart";
import { Metadata } from "next";
import Breadcrumb from "antd/es/breadcrumb";

export const metadata: Metadata = {
  title: "Podíl všech anomálních kontrol - STK Portál",
};

export default function InspectionResultByMakePage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            {
              title: (
                <Link href="/stations">Stanice (souhrnné statistiky)</Link>
              ),
            },
            { title: "Podíl všech anomálních kontrol" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <AnomalousInspectionsChart></AnomalousInspectionsChart>

          <p>
            Histogram zobrazuje rozdělení podílů anomálních prohlídek napříč
            stanicemi. Určitý podíl anomálií je tedy poměrně běžný, podezřelé
            je, pokud je podíl anomálních prohlídek dané stanice na některé z
            krajních stran grafu.
          </p>

          <p>
            Anomální prohlídky mohou být dvou druhů. Jednak situace, kdy vozidlo
            na STK neprošlo a následně opakovalo kontrolu na jiné stanici, kde
            už prošlo. Většinou totiž platí, že prohlídka je opakována na stejné
            stanici a výjimka je tudíž anomálií. Druhý typ anomálie nastává,
            když je zjištěno alespoň o 5 lehkých závad méně než na předchozí
            pravidelné kontrole. Zaměřujeme se pouze na lehké závady, protože
            většina z nich se týká koroze či mírného opotřebení některých dílů
            na podvozku. Tyto závady nebývají opravovány tak důsledně jako
            závažné závady, proto je anomální, když se jejich počet takto
            výrazně sníží.
          </p>

          <p>
            Přesný počet anomálií každého druhu a podíl anomálních prohlídek na
            celkovém počtu provedených je k dispozici pro každou stanici na její
            stránce s detaily. Tam lze přejít pomocí vyhledávače, nebo kliknutím
            na stanici v mapě, obojí na{" "}
            <Link href="/stations">obecné stránce stanic</Link>.
          </p>
        </div>
      </Container>
    </>
  );
}
