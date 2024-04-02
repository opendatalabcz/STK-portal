"use client";

import { Card, Spin } from "antd";
import useSWR from "swr";

export type TotalAnomalousInspectionsData = {
  station_id: string;
  anomalous: number;
  total: number;
  ratio: number;
};

export default function TotalAnomalousInspectionsDisplay({
  station,
}: {
  station: string;
}) {
  const { data: thisStationCount } = useSWR(
    `/api/stations_total_anomalies_by_station?station_id=eq.${station}`,
    async (key) => {
      const res = await fetch(key);
      const data: TotalAnomalousInspectionsData[] = await res.json();
      return data[0];
    }
  );

  return <Card size="small">{_buildDisplay()}</Card>;

  function _buildDisplay() {
    if (thisStationCount == undefined) {
      return <Spin></Spin>;
    }

    return (
      <>
        <span className="text-2xl text-cyan-500">
          {Intl.NumberFormat("cs-CZ", {
            maximumFractionDigits: 2,
          }).format(thisStationCount.ratio * 100)}
        </span>{" "}
        % anomálních prohlídek na této stanici (
        {Intl.NumberFormat("cs-CZ").format(thisStationCount.anomalous)} z{" "}
        {Intl.NumberFormat("cs-CZ").format(thisStationCount.total)})
      </>
    );
  }
}
