import { Card, Spin, Statistic } from "antd";
import useSWR from "swr";

export default function VehicleCounterActive({
  make,
  model,
}: {
  make: string;
  model: string;
}) {
  const { data: vehicleCount, isLoading: vehicleCountIsLoading } = useSWR(
    `/api/vehicles?make=eq.${make}&model_primary=eq.${model}&operating_state=eq.PROVOZOVANÉ`,
    async (key: string) => {
      const res = await fetch(key, {
        headers: { Prefer: "count=exact" },
      });
      return parseInt(res.headers.get("content-range")?.split("/")[1] ?? "NaN");
    }
  );

  if (vehicleCount == undefined) {
    return <></>;
  }

  return (
    <Statistic
      title="z toho"
      value={Intl.NumberFormat("cs-CZ", {
        maximumFractionDigits: 0,
      }).format(vehicleCount)}
      suffix={<span>&nbsp;v provozu</span>}
    ></Statistic>
  );
}
