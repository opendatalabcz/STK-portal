import { green } from "@ant-design/colors";
import { Tag, Tooltip } from "antd";
import Link from "next/link";
import useSWR from "swr";

interface IStringMap {
  [index: string]: string;
}

const defectTypeColorMap = {
  A: "green",
  B: "orange",
  C: "red",
} as IStringMap;

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
      <Tooltip
        title={
          <>
            <Tag color={defectTypeColorMap[data.type]}>{data.type}</Tag>{" "}
            {data.description}
          </>
        }
      >
        <Link href={`/defects#${defect}`}>
          <Tag color={defectTypeColorMap[data.type]}>{defect}</Tag>
        </Link>
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
