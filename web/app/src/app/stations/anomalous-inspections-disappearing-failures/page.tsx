import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import InspectionsWithDissapearingFailuresChart from "./InspectionsWithDissapearingFailuresChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prohlídky s mizejícími závady - STK Portál",
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
            { title: "Prohlídky s mizejícími závady" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <InspectionsWithDissapearingFailuresChart></InspectionsWithDissapearingFailuresChart>

          <p>
            Jedná se o počet kontrol, při kterých bylo zjištěno alespoň o 5
            lehkých závad méně než na předchozí pravidelné kontrole. Zaměřujeme
            se pouze na lehké závady, protože většina z nich se týká koroze či
            mírného opotřebení některých dílů na podvozku. Tyto závady nebývají
            opravovány tak důsledně jako závažné závady, proto je anomální, když
            se jejich počet takto výrazně sníží.
          </p>

          <p>
            Histogram zobrazuje rozdělení počtů těchto anomálií napříč
            stanicemi.
          </p>

          <p>
            Přesný počet anomálií každého druhu a podíl anomálních prohlídek na
            celkovém počtu provedených je k dispozici pro každou stanici na její
            stránce s detaily. Tam lze přejít pomocí vyhledávače, nebo kliknutím
            na stanici v mapě, obojí na{" "}
            <Link href="/stations">obecné stránce stanic</Link>.
          </p>
        </div>
      </Container>
    </>
  );
}
