import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import AverageAgeOfImportedChart from "./AverageAgeOfImportedChart";
import { Metadata } from "next";
import Breadcrumb from "antd/es/breadcrumb";

export const metadata: Metadata = {
  title: "Průměrné stáří ojetin při importu - STK Portál",
};

export default function DriveTypePage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Průměrné stáří ojetin při importu" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <AverageAgeOfImportedChart></AverageAgeOfImportedChart>

          <p>
            Za importovaný považujeme automobil, jehož rozdíl v obecné první
            registraci a první registraci v ČR je alespoň 365 dní. Hodnota v
            grafu udává průměrný věk všech takovýchto osobních automobilů, které
            byly v daném roce poprvé registrované v ČR. Jedná se proto pouze o
            odhad, použitá data z registru vozidel totiž neobsahují informaci o
            původu vozidla a u mnoha také chybí rok výroby &ndash; ten se může
            od data první registrace lišit.
          </p>

          <p>
            Způsob odlišení importovaného a nového vozidla pouze podle rozdílu
            dat registrace není 100% přesný. Můžeme si ale hodnoty ověřit na
            webu Svazu dovozců automobilů, který nabízí statistiky
            registrovaných nových i ojetých osobních automobilů{" "}
            <a href="https://portal.sda-cia.cz/stat.php?m#str=nova">zde</a>.
            Srovnáme-li absolutní počty registrovaných automobilů v obou
            skupinách, liší se ve většině let maximálně o 5 %, přičemž má být
            podle SDA větší poměr ojetin. Zde použitá metodika je tedy na svou
            jednoduchost poměrně přesná, nejspíš jen mírně nadhodnocuje podíl
            nových vozidel.
          </p>

          <p>
            Pokud bychom snížili požadovaný rozdíl mezi daty registrace na 90
            dní, hodnoty by se snížily zhruba o 0,2 roku. Přidali-li bychom
            požadavek na minimální zjištěný nájezd při evidenční kontrole na
            1000 kilometrů, hodnota by se mírně zvýšila zhruba o setinu roku
            &ndash; přiblížili bychom se tak &quot;správnému&quot; poměru
            importovaných vozidel podle SDA. Toto bylo zjištěno na části
            registru vozidel, k níž máme odpovídající data o prohlídkách.
            Jelikož vliv požadavku na minimální nájezd na výsledek je ale
            poměrně malý, lze od něj upustit a získat tak rozumně důvěryhodnou
            hodnotu i pro dřívější roky, pro které data o prohlídkách nemáme.
          </p>

          <p>
            Protože jsou ale data první registrace pro stará vozidla (kolem roku
            1990) často &quot;zaokrouhlená&quot; na 1. leden daného roku, jejich
            přesnost je diskutabilní a analýzu proto raději omezíme na vozidla
            registrovaná poprvé v ČR od roku 2000 dál.
          </p>
        </div>
      </Container>
    </>
  );
}
