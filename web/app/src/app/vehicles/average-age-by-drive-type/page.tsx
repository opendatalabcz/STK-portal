import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import AverageAgeByDriveTypeChart from "./AverageAgeByDriveTypeChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Průměrný věk OA podle typu pohonu - STK Portál",
};

export default function DriveTypePage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Průměrný věk OA podle typu pohonu" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <AverageAgeByDriveTypeChart></AverageAgeByDriveTypeChart>

          <p>
            Graf zobrazuje odhad průměrného věku osobních automobilů
            provozovaných v daném roce podle jejich typu pohonu. Běžně uváděné
            hodnoty průměrného věku osobních automobilů jsou o poznání vyšší,
            více informací k metodice je uvedeno u analýzy{" "}
            <a href="/vehicles/average-age">průměrného stáří OA</a>. Typy pohonu
            jsou seskupeny do několika zjednodušených kategorií, vysvětlení je k
            dispozici u analýzy{" "}
            <a href="/vehicles/drive-type">
              popularity jednotlivých typů pohonů
            </a>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
