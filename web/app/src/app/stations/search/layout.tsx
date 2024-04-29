import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vyhledávání stanic - STK Portál",
};

export default function SearchPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
