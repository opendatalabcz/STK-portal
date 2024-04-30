import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status vozidel - STK Portál",
};

export default function VehiclePage({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
