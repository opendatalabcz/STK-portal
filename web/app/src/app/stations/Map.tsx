"use client";

import Card from "antd/es/card/Card";
import useSWR from "swr";
// import "@react-leaflet/core";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// import { MarkerClusterGroup } from "@changey/react-leaflet-markercluster";
// import MarkerClusterGroup from "react-leaflet-markercluster";
import { useState } from "react";
import Button from "antd/es/button";
import { useRouter } from "next/navigation";

// import "leaflet/dist/leaflet.css";

export default function Map() {
  const router = useRouter();

  const { data: stations, isLoading: stationsIsLoading } = useSWR(
    "/api/stations?and=(latitude.not.is.null,longitude.not.is.null)",
    async (key) => {
      const res = await fetch(key);
      const data: Station[] = await res.json();
      console.log(data);
      return data;
    }
  );

  return (
    <Card>
      <div className="items-center h-96">
        <MapContainer center={[49.816389, 15.476944]} zoom={7}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* <MarkerClusterGroup chunkedLoading> */}
          {stations &&
            stations.map((s) => (
              <Marker key={s.id} position={[s.latitude!, s.longitude!]}>
                <Popup>
                  <div className="pb-1 space-y-1">
                    <h2 className="pb-2 text-lg">{s.company}</h2>
                    <p>{s.street}</p>
                    <p className="pb-3">
                      {s.postal_code} {s.city}
                    </p>
                    <Button
                      onClick={() => {
                        router.push(`/stations/${s.id}`);
                      }}
                    >
                      Detail
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          {/* </MarkerClusterGroup> */}
        </MapContainer>
      </div>
      <p className="pt-1 text-sm">
        Některé stanice mohou chybět, pokud k nim není dostupná poloha.
      </p>
    </Card>
  );
}
