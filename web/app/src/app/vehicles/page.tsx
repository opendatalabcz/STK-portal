"use client";

import Card from "antd/es/card";
import SearchBox from "./SearchBox";
import AverageAgeChart from "./changes_in_time/average_age";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import { Breadcrumb } from "antd";
import Link from "next/link";

export default function VehiclesPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: "Vozidla" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <h1 className="pb-4 text-3xl">Vozidla</h1>

        <SearchBox></SearchBox>

        <h1 className="pt-8 text-3xl">Statistiky</h1>

        <h2 className="pt-4 text-2xl">Proměny vozového parku v čase</h2>
          <AverageAgeChart></AverageAgeChart>
          <ColorsChart></ColorsChart>
      </Container>
    </>
  );
}
