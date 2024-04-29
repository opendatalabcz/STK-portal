import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import InspectionResultByMakeBrowser from "./InspectionResultByMakeBrowser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poměrný výsledek prohlídek populárních značek - STK Portál",
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
            { title: "Poměrný výsledek prohlídek populárních značek" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <InspectionResultByMakeBrowser></InspectionResultByMakeBrowser>

          <p>
            Graf zobrazuje percentuální podíl výsledků všech kontrol dané značky
            v daném roce. Zobrazeny jsou pouze podíly nezpůsobilého a částečně
            způsobilého výsledku, zbytek do 100 % tvoří úspěšné kontroly. Čím
            menší jsou tedy oba sloupce dohromady, tím více vozidel dané značky
            prošlo STK úspěšně.
          </p>
        </div>
      </Container>
    </>
  );
}
