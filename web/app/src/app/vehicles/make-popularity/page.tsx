import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import MakePopularityBrowser from "./MakePopularityBrowser";
import SelectedMakesPopularityChart from "./SelectedMakesPopularityBrowser";

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
            čemuž není například možné zobrazit vývoj počtu velmi raritních
            značek. Jednotlivé oddíly proto slouží jednoduše k rozdělení značek
            na menší skupiny, aby byly grafy čitelnější.
          </p>
        </div>
      </Container>
    </>
  );
}
