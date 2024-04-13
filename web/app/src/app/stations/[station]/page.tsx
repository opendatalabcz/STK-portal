"use client";

import { Breadcrumb, Spin } from "antd";
import Card from "antd/es/card/Card";
import {
  CarOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import useSWR from "swr";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import InspectionFrequencyBrowser from "./InspectionFrequencyBrowser";
import TopMakesBrowser from "./TopMakesBrowser";
import TopModelsBrowser from "./TopModelsBrowser";
import { Icon } from "leaflet";
import RepeatedInspectionsChart from "./RepeatedInspectionsChart";
import RepeatedInspectionsDisplay from "./RepeatedInspectionsDisplay";
import InspectionsWithDissapearingFailuresDisplay from "./InspectionsWithDissapearingFailuresDisplay";
import InspectionsWithDissapearingFailuresChart from "./InspectionsWithDissapearingFailuresChart";
import TotalAnomalousInspectionsChart from "./TotalAnomalousInspectionsChart";
import TotalAnomalousInspectionsDisplay from "./TotalAnomalousInspectionsDisplay";
import InspectionsOnFrequentDaysChart from "./InspectionsOnFrequentDaysChart";
import InspectionsOnFrequentDaysDisplay from "./InspectionsOnFrequentDaysDisplay";

export default function StationDetailPage({
  params: { station },
}: {
  params: { station: string };
}) {
  const { data, isLoading } = useSWR(
    `/api/stations?id=eq.${station}`,
    async (key) => {
      const res = await fetch(key);
      const data: Station[] = await res.json();
      console.log(data);
      return data[0];
    }
  );

  if (data) {
    const icon = new Icon({
      iconUrl: "/icon-marker.svg",
    });

    return (
      <>
        <BreadcrumbsContainer>
          <Breadcrumb
            items={[
              { title: <Link href="/">STK portál</Link> },
              { title: <Link href="/stations">Stanice</Link> },
              { title: data.company },
            ]}
          ></Breadcrumb>
        </BreadcrumbsContainer>

        <Container>
          <h1 className="pb-4 text-3xl">{data.company}</h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <CarOutlined className="mt-1" />
                <div>
                  {/* <p>
                  Kód {data.id.substring(0, 2)}.{data.id.substring(2, 5)}
                </p> */}
                  <p>Kontroluje {data.inspection_types.join(", ")}</p>
                </div>
              </div>
              <hr className="my-2"></hr>
              <div className="flex items-start space-x-2">
                <EnvironmentOutlined className="mt-1" />
                <div>
                  <p>{data.street}</p>
                  <p>
                    {data.postal_code} {data.city}
                  </p>
                </div>
              </div>
              <hr className="my-2"></hr>
              <div className="flex items-start space-x-2">
                <PhoneOutlined className="mt-1" />
                <div>
                  {data.phones.map((p) => (
                    <p key={p}>
                      <a href={`tel:${p}`}>{p}</a>
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MailOutlined className="mt-1" />
                <div>
                  {data.emails.map((m) => (
                    <p key={m}>
                      <a href={`mailto:${m}`}>{m}</a>
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {data.latitude != null && data.longitude != null ? (
              <Card size="small">
                <div className="h-64">
                  <MapContainer
                    center={[data.latitude, data.longitude]}
                    zoom={13}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[data.latitude, data.longitude]}
                      icon={icon}
                    ></Marker>
                  </MapContainer>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="flex items-center justify-center h-64">
                  Mapa pro tuto stanici není dostupná
                </div>
              </Card>
            )}
          </div>

          <h1 className="pt-4 text-3xl">Statistiky</h1>

          <h2 className="pt-4 text-2xl">Značky a modely</h2>
          <hr></hr>
          <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
            <TopMakesBrowser station={station}></TopMakesBrowser>
            <TopModelsBrowser station={station}></TopModelsBrowser>
          </div>

          <h2 className="pt-4 text-2xl">Predikce vytíženosti</h2>
          <hr></hr>
          <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
            <div>
              <InspectionFrequencyBrowser
                station={station}
              ></InspectionFrequencyBrowser>
            </div>
            <div className="space-y-4">
              <p>
                Predikce vytíženosti funguje na principu průměrování počtu
                prohlídek ve stejném týdnu napříč roky. Graf tedy zobrazuje
                průměrnou vytíženost v tomto týdnu na základě známé historie
                prohlídek.
              </p>
              <p>
                Při rozhodování, který den na kontrolu jet, je ale navíc potřeba
                brát v úvahu, že páteční otevírací doba bývá u mnoha stanic
                zkrácená. Navíc je nutné počítat se svátky, jejichž posun tato
                metoda zachytit nedokáže.
              </p>
            </div>
          </div>

          <h1 className="pt-8 text-3xl">Anomální kontroly</h1>

          <h2 className="pt-4 text-2xl">Podíl anomálií vůči všem kontrolám</h2>
          <hr></hr>
          <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
            <div className="space-y-4">
              <TotalAnomalousInspectionsDisplay
                station={station}
              ></TotalAnomalousInspectionsDisplay>
              <p>
                Podíl anomálních kontrol na všech kontrolách provedených na této
                stanici.
              </p>
              <p>
                Histogram zobrazuje rozdělení podílů anomálních prohlídek napříč
                stanicemi. Stanice je podezřelá, pokud má podíl anomálních
                kontrol výrazně vyšší než je u většiny ostatních stanic. Vysoké
                absolutní počty anomálních prohlídek vyjmenovaných níže se v
                tomto histogramu nemusí projevit, protože stanice s velkým
                počtem anomálií může zároveň provádět velké množství prohlídek
                obecně.
              </p>
            </div>
            <TotalAnomalousInspectionsChart
              station={station}
            ></TotalAnomalousInspectionsChart>
          </div>

          <h2 className="pt-4 text-2xl">Jednotlivé typy anomálií</h2>
          <hr></hr>
          <p className="pt-4">
            Následující sekce rozděluje anomalitu kontrol podle tří různých
            kritérií. Histogram se vždy týká porovnání počtu zjištěných anomálií
            na této stanici s počtem zjištěným na ostatních stanicích napříč
            celou ČR. Pozice aktuální stanice je v histogramu zvýrazněna
            červeně.
          </p>

          <h3 className="pt-4 text-xl">Nadměrně vytížené dny</h3>
          <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
            <div className="space-y-4">
              <InspectionsOnFrequentDaysDisplay
                station={station}
              ></InspectionsOnFrequentDaysDisplay>
              <p>
                Prohlídka v nadměrně vytíženém dni, kdy proběhlo výrazně více
                kontrol než je průměrem, může indikovat zvýšené nároky na
                personál a potenciální vliv na průběh prohlídky. Za výjimečně
                frekventovaný den se považuje takový, kdy počet provedených
                prohlídek je o dvě standardní odchylky vyšší než průměr daného
                měsíce. Tato hranice byla zvolena tak, aby bylo označeno pouze
                malé procento dní a tempo práce muselo tedy na stanici být
                nadstandardní.
              </p>
            </div>
            <InspectionsOnFrequentDaysChart
              station={station}
            ></InspectionsOnFrequentDaysChart>
          </div>

          <h3 className="pt-4 text-xl">
            Úspěšné opakování kontroly na jiné stanici
          </h3>
          <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
            <div className="space-y-4">
              <RepeatedInspectionsDisplay
                station={station}
              ></RepeatedInspectionsDisplay>
              <p>
                Tato analýza označuje jako anomální ty situace, kdy vozidlo na
                STK neprošlo a následně opakovalo kontrolu na jiné stanici, kde
                už prošlo. Většinou totiž platí, že prohlídka je opakována na
                stejné stanici a výjimka je tudíž anomálií. Počet anomálií
                uvedený výše odpovídá počtu těchto opakovaných úspěšných kontrol
                na této stanici.
              </p>
            </div>
            <RepeatedInspectionsChart
              station={station}
            ></RepeatedInspectionsChart>
          </div>

          <h3 className="pt-4 text-xl">Mizející závady</h3>
          <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
            <div className="space-y-4">
              <InspectionsWithDissapearingFailuresDisplay
                station={station}
              ></InspectionsWithDissapearingFailuresDisplay>
              <p>
                Jedná se o počet kontrol, při kterých bylo zjištěno alespoň o 5
                lehkých závad méně než na předchozí pravidelné kontrole.
                Zaměřujeme se pouze na lehké závady, protože většina z nich se
                týká koroze či mírného opotřebení některých dílů na podvozku.
                Tyto závady nebývají opravovány tak důsledně jako závažné
                závady, proto je anomální, když se jejich počet takto výrazně
                sníží.
              </p>
            </div>
            <InspectionsWithDissapearingFailuresChart
              station={station}
            ></InspectionsWithDissapearingFailuresChart>
          </div>
        </Container>
      </>
    );
  } else if (isLoading) {
    return (
      <div className="flex items-center justify-center grow">
        <Spin></Spin>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 grow">
        <p>Stanice nebyla nalezena</p>
        <Link href={"/stations"} className="text-primary">
          Zpět na přehled stanic
        </Link>
      </div>
    );
  }
}
