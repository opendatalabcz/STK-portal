import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { station: string };
}): Promise<Metadata> {
  const station: Station[] = await fetch(
    `${process.env.api}/stations?id=eq.${params.station}`
  ).then((res) => res.json());

  return {
    title: station[0].company + " - STK Portál",
  };
}

export default function StationPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
