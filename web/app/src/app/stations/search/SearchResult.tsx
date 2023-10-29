import Card from "antd/es/card/Card";
import Link from "next/link";

export default function SearchResult({
  station: station,
}: {
  station: Station;
}) {
  return (
    <Link href={`/stations/${station.id}`}>
      <Card>
        <h2 className="text-lg text-blue-500">{station.company}</h2>
        <p>
          {station.street}, {station.postal_code} {station.city}
        </p>
      </Card>
    </Link>
  );
}
