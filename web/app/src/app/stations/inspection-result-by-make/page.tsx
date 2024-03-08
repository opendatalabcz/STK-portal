import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import InspectionResultByMakeBrowser from "./InspectionResultByMakeBrowser";

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

          <p>Cim mensi celkovy sloupec, tim lepsi.</p>
        </div>
      </Container>
    </>
  );
}
