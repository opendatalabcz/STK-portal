import Breadcrumb from "antd/es/breadcrumb";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import MileageByDriveTypeChart from "./MileageByDriveTypeChart";
import MileageByDriveTypeStackedChart from "./MileageByDriveTypeStackedChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Celkový nájezd podle typu pohonu - STK Portál",
};

export default function EcologyPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Celkový nájezd podle typu pohonu" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <MileageByDriveTypeChart></MileageByDriveTypeChart>
          <MileageByDriveTypeStackedChart></MileageByDriveTypeStackedChart>

          <p>
            Statistika ukazuje součet stavů najetých kilometrů všech vozidel,
            která byla v daném roce na technické kontrole, rozdělený podle typu
            pohonu vozidel. Vidíme tedy, jak se mění využití jednotlivých paliv.
            Nejedná se o součet přírůstků nájezdů vůči předchozímu roku či
            předchozí kontrole každého z vozidel, ale o součet celkového
            dosavadního nájezdu.
          </p>

          <p>
            Pokud tedy celková výška sloupce v každém roce roste, může to
            naznačovat stárnutí vozového parku a provozem vozidel s vyšším
            nájezdem nebo také celkově větší počet provozovaných vozidel. V roce
            2022 pozorujeme mírné meziroční snížení sloupce, dá se tedy usoudit,
            že v předchozích dvou letech se (zřejmě vlivem Covid-19) uskutečnil
            menší nájezd než dříve, zatímco starší vozidla s vysokým nájezdem
            zanikla či byla vyvezena a nebyla proto na STK. Rok 2021 zaznamenal
            naopak meziroční zvýšení, ale to Covidové interpretaci neodporuje,
            protože se do tohoto roku započítala změna nájezdů vozidel i za
            Covidem nepostižený rok 2019 &ndash; vozidla jezdí na STK pouze
            každé dva roky.
          </p>

          <p>
            Jelikož je součet nájezdů získáván z vozidel, která byla daný rok na
            kontrole, budeme pozorovat zvyšování podílu elektrifikovaného
            nájezdu vůči podílu nově registrovaných elektrifikovaných vozidel
            zhruba se čtyřletým zpožděním, protože nová vozidla s významnějším
            nájezdem teprve po čtyřech letech pojedou na pravidelnou technickou
            kontrolu. Navíc tento graf nelze interpretovat jako podíl nájezdů
            podle paliva uskutečněných v daném roce &ndash; pro takovou
            interpretaci by bylo nutné analyzovat roční přírůstky nájezdu.
          </p>

          <p>
            Poměrný nájezd nafty může být také zvyšován jejím uplatněním u
            nákladních vozidel a dodávek, které mají zpravidla vyšší nájezd.
          </p>

          <p>
            Skutečný údaj o typu pohonu v technickém průkazu může být
            složitější, pohony jsou proto seskupeny do jednodušších kategorií,
            které jsou popsány <a href="/vehicles/drive-type">zde</a>.
          </p>
        </div>
      </Container>
    </>
  );
}
