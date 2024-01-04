"use client";

import Card from "antd/es/card";
import SearchBox from "./SearchBox";
import Map from "./Map";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import { Breadcrumb } from "antd";
import Link from "next/link";

export default function StationsPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: "Stanice" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <h1 className="pb-4 text-3xl">Stanice</h1>

        <div className="pb-4">
          <SearchBox></SearchBox>
        </div>

        <Map></Map>

        <h1 className="pt-8 text-3xl">Statistiky</h1>

        <h2 className="pt-4 text-2xl">Průměrné výsledky kontrol</h2>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2 2xl:grid-cols-3">
          <Card>
            <h3 className="text-lg">Graf</h3>
          </Card>
          <Card>
            <h3 className="text-lg">Graf</h3>
          </Card>
          <Card>
            <h3 className="text-lg">Graf</h3>
          </Card>
          <Card>
            <h3 className="text-lg">Graf</h3>
          </Card>
        </div>
      </Container>
    </>
  );
}
