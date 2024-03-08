import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import AverageInspectionCountBySeverityBrowser from "./AverageInspectionCountBySeverityBrowser";
import AverageSevereInspectionCountBrowser from "./AverageSevereInspectionCountBrowser";

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
            Nebezpecne zavady jsou zobrazene podle spodni osy, protoze jich je
            velmi malo a pokud by vsechny pocty byly na stejne ose, nebyly by
            skoro videt.
          </p>
        </div>
      </Container>
    </>
  );
}
