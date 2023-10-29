"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NumberBox from "@/components/NumberBox";
import { Button, ConfigProvider, Input, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { LoadingOutlined } from "@ant-design/icons";
import theme from "./themeConfig";
import useSWR from "swr";

async function fetcher(key: string) {
  const res = await fetch(key, {
    headers: { Prefer: "count=estimated" },
  });
  return parseInt(res.headers.get("content-range")?.split("/")[1] ?? "NaN");
}

export default function Home() {
  // TODO: Add error handling using a redirect to error page.
  const { data: vehicleCount, isLoading: vehicleCountIsLoading } = useSWR(
    "/api/vehicle_register",
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
      console.log(data);
      return data[0]["date"].split("-")[0];
    });

  return (
    <ConfigProvider theme={theme}>
      <Layout>
        <Header></Header>
        <Content>
          <main className="flex flex-col items-center max-w-screen-lg px-4 mx-auto my-4 space-y-8">
            <p className="leading-relaxed md:w-3/4 xl:w-4/5">
              Vítejte na STK portálu. Naleznete zde informace o stanicích
              technické kontroly, detaily o vozidlech v ČR, statistiky vozového
              parku a prohlídek na STK. Portál nabízí také průvodce výběrem
              auta. To vše na základě dat z registru silničních vozidel a
              záznamů o prohlídkách na STK zveřejněných MDČR (a případnými
              dalšími subjekty).
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumberBox title="Vozidel v registru">
                <p className="pb-1 text-3xl font-medium">
                  {vehicleCountIsLoading ? (
                    <LoadingOutlined spin={true} />
                  ) : (
                    vehicleCount?.toLocaleString("cs-CZ")
                  )}
                </p>
              </NumberBox>
              <NumberBox title="Stanic TK">
                <p className="pb-1 text-3xl font-medium">
                  {stationCountIsLoading ? (
                    <LoadingOutlined spin={true} />
                  ) : (
                    stationCount?.toLocaleString("cs-CZ")
                  )}
                </p>
              </NumberBox>
              <NumberBox title="Kontrol na STK">
                <p className="pb-1 text-3xl font-medium">
                  {inspectionCountIsLoading ? (
                    <LoadingOutlined spin={true} />
                  ) : (
                    inspectionCount?.toLocaleString("cs-CZ")
                  )}
                </p>
              </NumberBox>
              <NumberBox title="Časové pokrytí">
                <p className="pb-1 text-3xl font-medium">
                  {newestInspectionIsLoading ? (
                    <LoadingOutlined spin={true} />
                  ) : (
                    `2018–${newestInspection}`
                  )}
                </p>
              </NumberBox>
            </div>

            <div className="flex flex-col space-y-4">
              <Input
                placeholder="Hledejte VIN nebo stanici TK"
                className="p-2 md:w-96"
                size="large"
              ></Input>
              <div className="flex justify-center space-x-4">
                <Button type="primary" size="large">
                  Naskenovat VIN
                </Button>
                <Button size="large">Hledat</Button>
              </div>
            </div>
          </main>
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
  );
}