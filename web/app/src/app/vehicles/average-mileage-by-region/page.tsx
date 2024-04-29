import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import AverageMileageByRegionBrowser from "./AverageMileageByRegionBrowser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Průměrný nájezd OA podle kraje - STK Portál",
};

export default function MakePopularityPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Průměrný nájezd OA podle kraje" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <AverageMileageByRegionBrowser></AverageMileageByRegionBrowser>

          <p>
            Graf ukazuje, jak průměrně ojetá auta jsou auta při návštěvě STK v
            každém kraji. Nejedná se ale o průměrný nájezd vozidel v daném
            kraji, jednak protože vozidlo může být provozované i jinde, jednak
            protože nová vozidla do 4 let stáří se na STK prakticky nevyskytují
            a zobrazovaný průměr proto nemohou snižovat.
          </p>
        </div>
      </Container>
    </>
  );
}
