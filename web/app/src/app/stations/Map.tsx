"use client";

import Card from "antd/es/card/Card";
import useSWR from "swr";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Button from "antd/es/button";
import { useRouter } from "next/navigation";
import { Icon } from "leaflet";

export default function LazyMap() {
  const router = useRouter();

  const { data: stations, isLoading: stationsIsLoading } = useSWR(
    "/api/stations?and=(latitude.not.is.null,longitude.not.is.null)",
    async (key) => {
      const res = await fetch(key);
      const data: Station[] = await res.json();
      return data;
    }
  );

  const icon = new Icon({
    iconUrl: "/icon-marker.svg",
  });

  return (
    <Card>
      <div className="items-center h-96">
        <MapContainer center={[49.816389, 15.476944]} zoom={7}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {stations &&
            stations.map((s) => (
              <Marker
                key={s.id}
                position={[s.latitude!, s.longitude!]}
                icon={icon}
              >
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
        </MapContainer>
      </div>
      <p className="pt-1 text-sm">
        Některé stanice mohou chybět, pokud k nim není dostupná poloha.
      </p>
    </Card>
  );
}
