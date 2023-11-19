"use client";

import Card from "antd/es/card";
import SearchBox from "./SearchBox";
import AverageAgeChart from "./changes_in_time/average_age";
import Container from "@/components/Container";

export default function VehiclesPage() {
  return (
    <Container>
      <h1 className="pb-4 text-3xl">Vozidla</h1>

      <SearchBox></SearchBox>

      <h1 className="pt-8 text-3xl">Statistiky</h1>

      <h2 className="pt-4 text-2xl">Proměny vozového parku v čase</h2>
      <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2 2xl:grid-cols-3">
        <Card>
          <h3 className="text-lg">Průměrný věk osobních automobilů</h3>
          <AverageAgeChart></AverageAgeChart>
        </Card>
      </div>
    </Container>
  );
}
