import Tag from "antd/es/tag";
import Tooltip from "antd/es/tooltip";
import Link from "next/link";
import useSWR from "swr";

export default function StationTag({ station }: { station: string }) {
  const { data } = useSWR(`/api/stations?id=eq.${station}`, async (key) => {
    const res = await fetch(key);
    const data: Station[] = await res.json();
    return data[0];
  });

  return (
    <Tooltip
      title={
        data != null
          ? data.company + ", " + data.city
          : "Chybí informace o stanici"
      }
    >
      <Link href={`/stations/${station}`}>
        <Tag color="blue">{station}</Tag>
      </Link>
    </Tooltip>
  );
}
