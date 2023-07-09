import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return <div className="p-3 bg-gray-100 rounded-md">{children}</div>;
}
