import { Tooltip } from "antd";
import Link from "next/link";
import useSWR from "swr";

export default function DefectSpan({ defect }: { defect: string }) {
  const { data, isLoading } = useSWR(
    `/api/defects?code=eq.${defect}`,
    async (key) => {
      const res = await fetch(key);
      const data: Defect[] = await res.json();
      return data[0];
    }
  );

  if (data != null) {
    return (
      <Tooltip title={data.description}>
        <Link href={`/defects#${defect}`} title={data.description}>
          {defect}
        </Link>
      </Tooltip>
    );
  }

  return <Link href={`/defects#${defect}`}>{defect}</Link>;
}
