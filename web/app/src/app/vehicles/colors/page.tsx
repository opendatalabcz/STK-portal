import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import ColorsChart from "./ColorsChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podíl barev nově registrovaných vozidel - STK Portál",
};

export default function ColorsPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Podíl barev nově registrovaných vozidel" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <ColorsChart></ColorsChart>
          <p>
            Graf rozděluje 100 % nově registrovaných vozidel v každém roce na
            skupiny podle barvy uvedené v technickém průkazu. Nerozlišuje se zde
            konkrétní odstín ani provedení, např. populární stříbrná vozidla
            spadají do kategorie <span className="font-mono">šedá</span> apod.
            Za posledních třicet let pozorujeme značný úbytek červených, modrých
            a obecně barevných vozidel. Bílou skupinu mohou mimo to posilovat
            např. i dodávky, započítaná jsou zde totiž všechna vozidla nezávisle
            na typu.
          </p>
        </div>
      </Container>
    </>
  );
}
