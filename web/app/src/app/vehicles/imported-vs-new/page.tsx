import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import ImportedVsNewRatioChart from "./ImportedVsNewRatioChart";
import ImportedVsNewAbsoluteChart from "./ImportedVsNewAbsoluteChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poměr nových a importovaných ojetých OA - STK Portál",
};

export default function ColorsPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Poměr nových a importovaných ojetých OA" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <ImportedVsNewRatioChart></ImportedVsNewRatioChart>
          <ImportedVsNewAbsoluteChart></ImportedVsNewAbsoluteChart>

          <p>
            Za importovaný považujeme automobil, jehož rozdíl v obecné první
            registraci a první registraci v ČR je alespoň 365 dní. Pokud je
            tento rozdíl nižší, považujeme automobil za nově zakoupený. Více o
            metodice rozlišování vozidel a odhadu její přesnosti{" "}
            <a href="/vehicles/average-age-of-imported">zde</a>. Zjednodušeně se
            dá říci, že použitá metodika v každém roce nejvýše o 5 % chybně
            zvětšuje podíl nových automobilů na úkor importovaných ojetých.
            Hodnota sloupce v prvním grafu udává podíl obou skupin, který v
            součtu činí 100 % za každý rok, porovnávány jsou pouze osobní
            automobily. Druhý graf ukazuje absolutní počty osobních automobilů v
            obou skupinách.
          </p>
        </div>
      </Container>
    </>
  );
}
