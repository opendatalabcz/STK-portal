import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import TopDefectsBrowser from "./TopDefectsBrowser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nejčastější závady - STK Portál",
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
            { title: "Nejčastější závady" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <TopDefectsBrowser></TopDefectsBrowser>

          <p>
            Graf ukazuje nejčastěji zjištěné závady na všech kontrolách v daném
            roce. Pro zobrazení plného názvu závady stačí najet myší na
            příslušný sloupec. Všechny závady, jejich závažnosti a kategorie, do
            nichž spadají lze prohlížet v <a href="/defects">číselníku závad</a>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
