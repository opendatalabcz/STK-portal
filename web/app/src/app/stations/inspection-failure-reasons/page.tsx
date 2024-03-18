import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import InspectionFailureReasonsBrowser from "./InspectionFailureReasonsBrowser";

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
          <InspectionFailureReasonsBrowser></InspectionFailureReasonsBrowser>
          <p>
            Pro nejpopulárnější značky (podle počtu kontrol v daném roce) jsou
            zobrazeny tři nejčastější závady závažnosti B nebo C, které se
            objevily na kontrolách, kde bylo vozidlo shledáno částečně
            způsobilým nebo nezpůsobilým. Jedná se tedy o nejčastější důvody,
            proč vozidlo dané značky "neprošlo" STK.
          </p>
        </div>
      </Container>
    </>
  );
}
