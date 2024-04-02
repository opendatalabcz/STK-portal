import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import InspectionsOnFrequentDaysChart from "./InspectionsOnFrequentDaysChart";

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
            { title: "Prohlídky v nadměrně vytížených dnech" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <InspectionsOnFrequentDaysChart></InspectionsOnFrequentDaysChart>

          <p>
            Prohlídka v nadměrně vytíženém dni, kdy proběhlo výrazně více
            kontrol než je průměrem, může indikovat zvýšené nároky na personál a
            potenciální vliv na průběh prohlídky. Za výjimečně frekventovaný den
            se považuje takový, že počet provedených prohlídek je o dvě
            standardní odchylky vyšší než průměr daného měsíce. Tato hranice
            byla zvolena tak, aby bylo označeno pouze malé procento dní a tempo
            práce muselo tedy na stanici být nadstandardní.
          </p>

          <p>
            Histogram zobrazuje rozdělení počtů těchto anomálií napříč
            stanicemi.
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
