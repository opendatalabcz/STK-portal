import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import TotalInspectionsByResultChart from "./AverageInspectionResultChart";

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
            { title: "Počet kontrol podle výsledku" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <TotalInspectionsByResultChart></TotalInspectionsByResultChart>

          <p>
            Graf zobrazuje celkový počet kontrol provedených v každém roce
            rozdělený podle výsledku kontroly.
          </p>
        </div>
      </Container>
    </>
  );
}
