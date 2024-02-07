"use client";

import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import DriveTypeChart from "./DriveTypeChart";

export default function DriveTypePage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Typ pohonu nově registrovaných vozidel" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <DriveTypeChart></DriveTypeChart>
      </Container>
    </>
  );
}
