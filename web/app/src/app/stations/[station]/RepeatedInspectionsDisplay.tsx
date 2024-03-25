"use client";

import { Card, Spin } from "antd";
import useSWR from "swr";

type RepeatedInspectionsData = {
  station_id: string;
  count: number;
};

export default function RepeatedInspectionsDisplay({
  station,
}: {
  station: string;
}) {
  const { data: thisStationCount } = useSWR(
    `/api/stations_repeated_inspections_on_different_station?station_id=eq.${station}`,
    async (key) => {
      const res = await fetch(key);
      const data: RepeatedInspectionsData[] = await res.json();
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
        <span
          className={
            "text-2xl " + (thisStationCount.count >= 500 ? "text-red-500" : "")
          }
        >
          {thisStationCount.count}
        </span>{" "}
        anomálních prohlídek
      </>
    );
  }
}