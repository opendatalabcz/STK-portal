"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NumberBox from "@/components/NumberBox";
import { Button, ConfigProvider, Input, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { LoadingOutlined } from "@ant-design/icons";
import theme from "./themeConfig";
import useSWR from "swr";
import Container from "@/components/Container";

async function fetcher(key: string) {
  const res = await fetch(key, {
    headers: { Prefer: "count=estimated" },
  });
  return parseInt(res.headers.get("content-range")?.split("/")[1] ?? "NaN");
}

export default function Home() {
  // TODO: Add error handling using a redirect to error page.
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
            <div className="flex flex-col items-center max-w-screen-lg px-4 mx-auto space-y-8">
              <p className="leading-relaxed ">
                Vítejte na STK portálu. Naleznete zde informace o stanicích
                technické kontroly, detaily o vozidlech v ČR, statistiky
                vozového parku a prohlídek na STK. Portál nabízí také srovnání
                vozidel podle dostupných informací. To vše na základě dat z
                registru silničních vozidel a záznamů o prohlídkách na STK
                zveřejněných MDČR (a případnými dalšími subjekty).
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <NumberBox title="Vozidel v registru">
                  <p className="flex-wrap pb-1 text-3xl font-medium whitespace-break-spaces">
                    {vehicleCountIsLoading ? (
                      <LoadingOutlined spin={true} />
                    ) : (
                      vehicleCount?.toLocaleString("cs-CZ").replace(/\s/g, " ")
                    )}
                  </p>
                </NumberBox>
                <NumberBox title="Stanic TK">
                  <p className="flex-wrap pb-1 text-3xl">
                    {stationCountIsLoading ? (
                      <LoadingOutlined spin={true} />
                    ) : (
                      stationCount?.toLocaleString("cs-CZ").replace(/\s/g, " ")
                    )}
                  </p>
                </NumberBox>
                <NumberBox title="Kontrol na STK">
                  <p className="pb-1 text-3xl font-medium">
                    {inspectionCountIsLoading ? (
                      <LoadingOutlined spin={true} />
                    ) : (
                      inspectionCount
                        ?.toLocaleString("cs-CZ")
                        .replace(/\s/g, " ")
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
            </div>
          </Container>
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
  );
}
