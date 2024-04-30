"use client";

import Card from "antd/es/card";
import Spin from "antd/es/spin";
import useSWR from "swr";

export type InspectionsWithDissapearingFailuresData = {
  station_id: string;
  count: number;
};

export default function InspectionsWithDissapearingFailuresDisplay({
  station,
}: {
  station: string;
}) {
  const { data: thisStationCount } = useSWR(
    `/api/stations_dissapearing_failures_by_station?station_id=eq.${station}`,
    async (key) => {
      const res = await fetch(key);
      const data: InspectionsWithDissapearingFailuresData[] = await res.json();
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
        <span className="text-2xl text-red-500">{thisStationCount.count}</span>{" "}
        výskytů na této stanici
      </>
    );
  }
}
