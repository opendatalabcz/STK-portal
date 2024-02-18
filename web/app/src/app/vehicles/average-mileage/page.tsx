import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import AverageMileageChart from "./AverageMileageChart";

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
          <AverageMileageChart></AverageMileageChart>

          <p>
            Graf ukazuje, jak průměrně ojetá auta jsou auta při návštěvě STK v
            rámci celé ČR. Nejedná se ale o průměrný nájezd všech provozovaných
            vozidel, protože nová vozidla do 4 let stáří se na STK prakticky
            nevyskytují a zobrazovaný průměr proto nemohou snižovat.
          </p>
        </div>
      </Container>
    </>
  );
}
