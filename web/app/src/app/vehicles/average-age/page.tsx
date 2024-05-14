import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import AverageAgeChart from "./AverageAgeChart";
import { Metadata } from "next";
import Breadcrumb from "antd/es/breadcrumb";

export const metadata: Metadata = {
  title: "Průměrný věk osobních automobilů - STK Portál",
};

export default function DriveTypePage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Průměrný věk osobních automobilů" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <AverageAgeChart></AverageAgeChart>

          <p>
            Graf zobrazuje odhad průměrného věku osobních automobilů
            provozovaných v daném roce. Běžně uváděné hodnoty jsou o poznání
            vyšší, např. podle webu{" "}
            <a href="https://portal.sda-cia.cz/stat.php?v#rok=2023&mesic=12&kat=stav&vyb=&upr=&obd=m&jine=false&lang=CZ&str=vpp">
              Svazu dovozců automobilů
            </a>{" "}
            průměrné stáří osobního automobilu činilo v roce 2022 15,93 roku.
            Tato významná odchylka může být zapříčiněná dvěma faktory.
          </p>

          <p>
            Prvním možným vysvětlením odchylky je použitá datová sada. Verze
            registru vozidel používaná pro výpočet totiž neobsahuje historická a
            sportovní vozidla, jejichž stáří může průměr významně zvyšovat.
            Použitý datový soubor ani detail metodiky výpočtu na webu SDA
            nicméně není uveden, takže toto vysvětlení nelze potvrdit.
          </p>

          <p>
            Druhým vysvětlením může být fakt, že množina vozidel provozovaných v
            každém roce je pouze odhadnutá kombinací údajů z registru vozidel a
            z dat o proběhlých kontrolách na STK. Pro každé vozidlo je buď z
            registru známo, že je provozované. Pak jej počítáme mezi provozovaná
            všechny roky mezi jeho prvním datem registrace a datem pořízení
            exportu registru vozidel. V opačném případě je vozidlo v registru
            vedeno jako zaniklé, vyvezené či vyřazené z provozu. Pro taková
            vozidla předpokládáme, že pokud jeho poslední známá kontrola na STK
            skončila úspěšně, bylo toto vozidlo ještě více než rok provozované
            (odhad byl získán z porovnání počtu provozovaných a neprovozovaných
            vozidel podle registru a dat posledních známých TK proběhlých do
            dvou let před datem získání exportu registru). Odhadneme tak jeho
            pravděpodobný zánik na konec roku následujícího po poslední úspěšné
            kontrole. Pro každý rok poté vypočítáme průměrný věk všech
            odhadovaně provozovaných vozidel jako průměrný počet dnů mezi datem
            jejich první registrace (obecně, tj. i mimo ČR) a posledním dnem
            daného roku.
          </p>
        </div>
      </Container>
    </>
  );
}
