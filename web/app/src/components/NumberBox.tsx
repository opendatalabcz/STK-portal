export default function NumberBox({
  value,
  title,
}: {
  value: string;
  title: string;
}) {
  return (
    <div className="p-3 rounded-md border-2 border-gray-200">
      <p className="text-3xl font-medium">{value}</p>
      <p>{title}</p>
    </div>
  );
}
