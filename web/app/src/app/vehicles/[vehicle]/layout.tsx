import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { vehicle: string };
}): Promise<Metadata> {
  return {
    title: params.vehicle + " - STK Portál",
  };
}

export default function VehiclePage({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
