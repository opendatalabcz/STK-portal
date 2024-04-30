import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import AverageInspectionCountBySeverityBrowser from "./AverageInspectionCountBySeverityBrowser";
import AverageSevereInspectionCountBrowser from "./AverageSevereInspectionCountBrowser";
import { Metadata } from "next";
import Breadcrumb from "antd/es/breadcrumb";

export const metadata: Metadata = {
  title: "Průměrný počet závad podle závažnosti - STK Portál",
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
            { title: "Průměrný počet závad podle závažnosti" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <AverageInspectionCountBySeverityBrowser></AverageInspectionCountBySeverityBrowser>
          <AverageSevereInspectionCountBrowser></AverageSevereInspectionCountBrowser>

          <p>
            Graf ukazuje průměrný počet závad dané závažnosti zjištěný na každé
            kontrole podle kraje, kde sídlí stanice provádějící kontrolu.
            Nebezpečné závady jsou zobrazené na odděleném grafu, protože jejich
            počet je výrazně menší než je lehkých a vážných závad.
          </p>
        </div>
      </Container>
    </>
  );
}
