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
import Breadcrumbs from "@/components/Breadcrumbs";

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
    return (
      <>
        <Breadcrumbs>
          <Breadcrumb.Item href="/">STK portál</Breadcrumb.Item>
          <Breadcrumb.Item href="/stations">Stanice</Breadcrumb.Item>
          <Breadcrumb.Item>{data.company}</Breadcrumb.Item>
        </Breadcrumbs>

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
                    <p>
                      <a href={`tel:${p}`}>{p}</a>
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MailOutlined className="mt-1" />
                <div>
                  {data.emails.map((m) => (
                    <p>
                      <a href={`mailto:${m}`}>{m}</a>
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {data.latitude != null && data.longitude != null ? (
              <Card>
                <div className="h-64">
                  <MapContainer
                    center={[data.latitude, data.longitude]}
                    zoom={13}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[data.latitude, data.longitude]}></Marker>
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
          <h2 className="pt-4 text-2xl">Průměrné výsledky kontrol</h2>
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
