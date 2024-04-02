"use client";

import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import { Breadcrumb, Segmented, Spin } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import { useState } from "react";
import VehicleComparator from "./vehicles/VehicleComparator";
import ModelComparator from "./models/ModelComparator";

enum ComparatorMode {
  vehicles,
  models,
}

export default function ComparePage() {
  const [mode, setMode] = useState(ComparatorMode.models);

  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: "Srovnání vozidel" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <h1 className="pb-4 text-3xl">Srovnání vozidel</h1>

        <p>
          Srovnávač vozidel umožňuje porovnat buď jednotlivá vozidla podle VIN,
          nebo obecné vlastnosti jednotlivých modelů. Typ srovnání zvolíte
          přepínačem níže.
        </p>

        <div className="py-4">
          <Segmented
            options={["Vozidla", "Modely"]}
            value={mode == ComparatorMode.models ? "Modely" : "Vozidla"}
            onChange={(value) => {
              setMode(
                value == "Vozidla"
                  ? ComparatorMode.vehicles
                  : ComparatorMode.models
              );
            }}
          />
        </div>

        {mode == ComparatorMode.vehicles && (
          <VehicleComparator></VehicleComparator>
        )}
        {mode == ComparatorMode.models && <ModelComparator></ModelComparator>}
      </Container>
    </>
  );
}
