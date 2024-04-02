import { Card, Spin, Statistic } from "antd";
import useSWR from "swr";

export default function VehicleCounter({
  make,
  model,
}: {
  make: string;
  model: string;
}) {
  const { data: vehicleCount, isLoading: vehicleCountIsLoading } = useSWR(
    `/api/vehicles?make=eq.${make}&model_primary=eq.${model}`,
    async (key: string) => {
      const res = await fetch(key, {
        headers: { Prefer: "count=exact" },
      });
      return parseInt(res.headers.get("content-range")?.split("/")[1] ?? "NaN");
    }
  );

  if (vehicleCount == undefined) {
    return <Spin className="py-4 pl-2"></Spin>;
  }

  return (
    <Statistic
      title={`${make} ${model}`}
      value={Intl.NumberFormat("cs-CZ", {
        maximumFractionDigits: 0,
      }).format(vehicleCount)}
      suffix={<span>&nbsp;vozidel</span>}
    ></Statistic>
  );
}
