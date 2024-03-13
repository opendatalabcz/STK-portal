import { Tag, Tooltip } from "antd";
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
        <Tag color="red">
          <Link
            href={`/defects#${defect}`}
            // title={data.description} // This would show along with the Ant tooltip.
          >
            <span className="text-red-500">{defect}</span>
          </Link>
        </Tag>
      </Tooltip>
    );
  }

  if (!isLoading) {
    return (
      <Tooltip title="Chybí popis závady">
        <Link href={`/defects#${defect}`}>{defect}</Link>
      </Tooltip>
    );
  }

  return <Link href={`/defects#${defect}`}>{defect}</Link>;
}
