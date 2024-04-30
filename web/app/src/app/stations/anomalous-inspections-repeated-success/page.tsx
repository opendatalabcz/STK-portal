import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import RepeatedInspectionsChart from "./RepeatedInspectionsChart";
import { Metadata } from "next";
import Breadcrumb from "antd/es/breadcrumb";

export const metadata: Metadata = {
  title: "Prohlídky s úspěšným opakováním na jiné stanici - STK Portál",
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
            { title: "Prohlídky s úspěšným opakováním na jiné stanici" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <RepeatedInspectionsChart></RepeatedInspectionsChart>

          <p>
            Tato analýza označuje jako anomální ty situace, kdy vozidlo na STK
            neprošlo a následně opakovalo kontrolu na jiné stanici, kde už
            prošlo. Většinou totiž platí, že prohlídka je opakována na stejné
            stanici a výjimka je tudíž anomálií. Počet anomálií uvedený výše
            odpovídá počtu těchto opakovaných úspěšných kontrol na této stanici.
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
