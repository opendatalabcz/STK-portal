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
            Nejcastejsi zavady u neuspesnych kontrol vsech nejcastejsich znacek
            jsou vzdy stejne, a to povrchove koroze kabiny, ramu a brzdoveho
            potrubi.
          </p>
        </div>
      </Container>
    </>
  );
}
