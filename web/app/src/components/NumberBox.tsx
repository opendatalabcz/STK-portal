"use client";

import { Card } from "antd";

export default function NumberBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode | undefined;
}) {
  return (
    <Card>
      {/* <p className="pb-1 text-3xl font-medium">{value ?? "?"}</p> */}
      {children}
      <p>{title}</p>
    </Card>
  );
}
