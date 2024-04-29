"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Card, ConfigProvider, Layout, Statistic } from "antd";
import { Content } from "antd/es/layout/layout";
import theme from "./themeConfig";
import useSWR from "swr";
import Container from "@/components/Container";
import SearchBox from "./SearchBox";
import DefectsByCategoryLatestYearChart from "./stations/top-defects-by-category/DefectsByCategoryLatestYearChart";
import ElectricDriveTypeChart from "./vehicles/electric-drive-type/ElectricDriveTypeChart";
import { firstInspectionYear } from "@/years";
import Link from "next/link";
import ColorsChart from "./vehicles/colors/ColorsChart";
import InspectionResultByTopMake from "./stations/inspection-result-by-make/InspectionResultByTopMake";

async function fetcher(key: string) {
  const res = await fetch(key, {
    headers: { Prefer: "count=estimated" },
  });
  return parseInt(res.headers.get("content-range")?.split("/")[1] ?? "NaN");
}

export default function Home() {
  const { data: vehicleCount, isLoading: vehicleCountIsLoading } = useSWR(
    "/api/vehicles",
    fetcher
  );
  const { data: stationCount, isLoading: stationCountIsLoading } = useSWR(
    "/api/stations",
    fetcher
  );
  const { data: inspectionCount, isLoading: inspectionCountIsLoading } = useSWR(
    "/api/inspections",
    fetcher
  );
  const { data: newestInspection, isLoading: newestInspectionIsLoading } =
    useSWR("/api/inspections?order=date.desc&limit=1", async (key) => {
      const res = await fetch(key);
      const data = await res.json();
      return data[0]["date"].split("-")[0];
    });

  return (
    <ConfigProvider theme={theme}>
      <Layout>
        <Header></Header>
        <Content className="flex flex-col items-stretch w-full mx-auto lg:w-10/12 2xl:w-8/12">
          <Container>
            <div className="flex flex-col">
              <div className="flex flex-row items-center self-center py-6 space-x-6">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width="64"
                  height="64"
                  className="self-center"
                ></Image>
                <h1 className="text-4xl font-bold">STK portál</h1>
              </div>

              <p className="leading-relaxed">
                Vítejte na STK portálu. Naleznete zde informace o stanicích
                technické kontroly, detaily o vozidlech v ČR, statistiky
                vozového parku a prohlídek na STK. Portál nabízí také srovnávač
                konkrétních vozidel i značek a modelů celkově. To vše na základě
                dat z registru silničních vozidel a záznamů o prohlídkách na STK
                zveřejněných Ministerstvem dopravy ČR a dalšími subjekty.{" "}
                <Link href="/about">Více o portálu a datech...</Link>
              </p>

              <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <Statistic
                    loading={vehicleCountIsLoading}
                    title="Vozidel v databázi"
                    value={vehicleCount
                      ?.toLocaleString("cs-CZ")
                      .replace(/\s/g, " ")}
                  ></Statistic>
                </Card>
                <Card>
                  <Statistic
                    loading={stationCountIsLoading}
                    title="Stanic TK"
                    value={stationCount
                      ?.toLocaleString("cs-CZ")
                      .replace(/\s/g, " ")}
                  ></Statistic>
                </Card>
                <Card>
                  <Statistic
                    loading={inspectionCountIsLoading}
                    title="Kontrol na STK"
                    value={inspectionCount
                      ?.toLocaleString("cs-CZ")
                      .replace(/\s/g, " ")}
                  ></Statistic>
                </Card>
                <Card>
                  <Statistic
                    loading={newestInspectionIsLoading}
                    title="Časové pokrytí"
                    value={firstInspectionYear + "–" + newestInspection}
                  ></Statistic>
                </Card>
              </div>

              <p className="pt-6 leading-relaxed">
                Vyhledávač umožňuje najít konkrétní vozidlo podle VIN (17
                znaků). Hledat lze také stanice technické kontroly podle názvu,
                města nebo kontaktních údajů (telefon, email).
              </p>

              <SearchBox></SearchBox>

              <h2 className="self-start pt-12 text-3xl">Kontroly na STK</h2>
              <p className="py-4">
                Jaký je průměrný výsledek kontroly populárních značek a modelů?
                Kvůli kterým závadám nejčastěji auta neprojdou STK? Kolik
                kontrol se vůbec celkem ročně provede? Prohlížejte statistiky o
                všech kontrolách nebo najděte konkrétní STK a její analýzu na
                stránce <Link href="/stations">stanic</Link>.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <DefectsByCategoryLatestYearChart
                    linkToDetails
                  ></DefectsByCategoryLatestYearChart>
                </div>
                <div>
                  <InspectionResultByTopMake
                    linkToDetails
                  ></InspectionResultByTopMake>
                </div>
              </div>
              <Link className="pt-2" href="/stations">
                Další statistiky stanic...
              </Link>

              <h2 className="self-start pt-6 text-3xl">Vozový park ČR</h2>
              <p className="py-4">
                Kolik kilometrů mají průměrně auta najeto v různých krajích? Jak
                se vyvíjí popularita značek a modelů? Jak roste popularita
                elektrifikovaných vozů ve srovnání s běžnými palivy? Jak staré
                jsou importované ojetiny? Nejen to se dozvíte na stránce{" "}
                <Link href="/vehicles">vozidel</Link>.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <ElectricDriveTypeChart
                    linkToDetails
                  ></ElectricDriveTypeChart>
                </div>
                <div>
                  <ColorsChart linkToDetails></ColorsChart>
                </div>
              </div>
              <Link className="pt-2" href="/vehicles">
                Další statistiky vozového parku...
              </Link>

              <h2 className="self-start pt-6 text-3xl">Srovnávač</h2>
              <p className="py-4">
                Jak se liší detailní technické parametry dvou různých vozů? Jaká
                je historie prohlídek obou vozů? Srovnejte si dvě vozidla podle
                jejich VIN ve <Link href="/compare">srovnávači</Link>. Srovnávač
                umožňuje také porovnat dva modely stejné nebo různé značky
                &ndash; můžete srovnat nabízené motorizace, úspěšnost na STK
                podle věku a další parametry.
              </p>
            </div>
          </Container>
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
  );
}
