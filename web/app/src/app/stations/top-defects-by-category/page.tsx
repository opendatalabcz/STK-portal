import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import DefectsByCategoryBrowser from "./DefectsByCategoryBrowser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nejčastější závady podle kategorie - STK Portál",
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
            { title: "Nejčastější závady podle kategorie" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <DefectsByCategoryBrowser></DefectsByCategoryBrowser>

          <p>
            Graf zobrazuje počet všech zjištěných závad na kontrolách v daném
            roce rozdělený do kategorií. M2 a M3 jsou vozidla hromadné dopravy
            osob. Jednotlivé kategorie závad a jejich plný název (pro zobrazení
            v grafu byly některé názvy zkráceny) lze prozkoumat v{" "}
            <a href="/defects">číselníku závad</a>.
          </p>
        </div>
      </Container>
    </>
  );
}
