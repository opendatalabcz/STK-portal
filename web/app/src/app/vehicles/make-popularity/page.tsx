import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import MakePopularityBrowser from "./MakePopularityBrowser";
import SelectedMakesPopularityChart from "./SelectedMakesPopularityBrowser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Popularita značek - STK Portál",
};

export default function MakePopularityPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Popularita značek" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <MakePopularityBrowser></MakePopularityBrowser>
          <SelectedMakesPopularityChart></SelectedMakesPopularityChart>

          <p>
            Ve vývoji počtu nových registrací jsou vybrané nejčastější značky,
            oddíl <span className="font-mono">Ostatní</span> pak obsahuje
            některé značky zajímavé spíše z historického hlediska. Export
            registru vozidel, na kterém je statistika založená, obsahuje
            explicitní názvy pouze 150 nejčastějších značek a modelů, kvůli
            čemuž není například možné spolehlivě zobrazit vývoj počtu velmi
            raritních značek.
          </p>

          <p>
            Toto omezení je ale zčásti vyřešeno kombinací dat z kontrol na STK,
            která obsahují explicitně vyjmenované i méně časté značky a modely.
            Pro vozidla, která byla na kontrole od roku 2018 dále (odkdy máme k
            dispozici data) tedy lze tyto údaje do registru vozidel doplnit na
            základě porovnání VIN kódu a zobrazit je zde. Je ovšem třeba mít na
            paměti, že ve skutečnosti jejich četnosti budou vyšší (alespoň pro
            data před rokem 2018), protože některá vozidla před tímto rokem
            mohla zaniknout a jsou proto sice v registru uvedená bez názvu
            značky či modelu, ale tyto údaje již nemůžeme z dostupných záznamů o
            kontorolách získat.
          </p>
        </div>
      </Container>
    </>
  );
}
