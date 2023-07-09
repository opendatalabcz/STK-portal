import Card from "./Card";

export default function NumberBox({
  value,
  title,
}: {
  value: string;
  title: string;
}) {
  return (
    <Card>
      <p className="pb-1 text-3xl font-medium">{value}</p>
      <p>{title}</p>
    </Card>
  );
}
