import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import InspectionResultByModelBrowser from "./InspectionResultByModelBrowser";

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
            { title: "Poměrný výsledek prohlídek populárních modelů" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <InspectionResultByModelBrowser></InspectionResultByModelBrowser>

          <p>
            Cim mensi celkovy sloupec, tim lepsi. Pozor ze "lepsi" modely muzou
            byt velmi mlade, takze ta auta logicky jeste nejsou tak neuspesna.
          </p>
        </div>
      </Container>
    </>
  );
}
