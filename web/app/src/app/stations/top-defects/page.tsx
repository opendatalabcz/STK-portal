import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import TopDefectsBrowser from "./TopDefectsBrowser";

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
            Najed mysi na sloupec, abys videl cely nazev zavady. M2 a M3 jsou
            vozidla hromadne dopravy, link na ciselnik zavad.
          </p>
        </div>
      </Container>
    </>
  );
}