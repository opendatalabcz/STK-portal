"use client";

import Card from "antd/es/card";
import SearchBox from "./SearchBox";
import Map from "./Map";

export default function StationsPage() {
  return (
    <>
      <h1 className="text-3xl">Stanice</h1>

      <SearchBox></SearchBox>

      <Map></Map>

      <h1 className="pt-4 text-3xl">Statistiky</h1>

      <h2 className="pt-4 text-2xl">Průměrné výsledky kontrol</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
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
    </>
  );
}
