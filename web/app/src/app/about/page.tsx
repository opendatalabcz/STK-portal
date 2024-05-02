import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import Link from "next/link";
import Breadcrumb from "antd/es/breadcrumb";

export default async function AboutPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: "O projektu" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <h1 className="pb-4 text-3xl">O projektu</h1>
        <p>
          STK portál vznikl jako diplomová práce na{" "}
          <a href="https://fit.cvut.cz/" target="_blank">
            Fakultě informačních technologií ČVUT
          </a>{" "}
          pod záštitou laboratoře otevřených dat{" "}
          <a href="https://opendatalab.cz/" target="_blank">
            OpenDataLab
          </a>
          . Portál nabízí informace získané na základě veřejně dostupných dat,
          která lze vytěžit pomocí statistických metod a strojového učení. Dva
          hlavní datové zdroje, tj. seznam kontrol na STK a registr vozidel, lze
          propojit na základě VIN kódu, který známe pro každé vozidlo v registru
          i každou proběhlou kontrolu. Díky tomu je možné zobrazit historii vozů
          v ČR a predikovat jejich chování do budoucnosti.
        </p>

        <h2 className="self-start pt-8 pb-4 text-3xl">Co je VIN?</h2>
        <p>
          VIN (vehicle identification number) je unikátní kód o 17 znacích,
          který identifikuje konkrétní vozidlo. Aby se předešlo záměně znaků při
          zhoršení čitelnosti kódu (VIN bývá mimo jiné vyražen do kovových části
          vozidla, které např. mohou zkorodovat), kód nesmí obsahovat písmena O,
          I a Q.
        </p>
        <p className="pt-4">VIN se dělí na tyto tři sekce.</p>
        <ul className="pt-4 pl-6 list-disc">
          <li>
            <span className="font-bold">WMI</span> (world manufacturer
            identifier) je tvořen třemi znaky identifikujícími výrobce. Kód
            přiděluje stát, ve kterém se nachází hlavní místo podnikání výrobce.
            Pro výrobce produkující méně než 500 vozidel ročně je posledním
            znakem vždy 9.
          </li>
          <li>
            <span className="font-bold">VDS</span> (vehicle description section)
            označuje pěti znaky obecné vlastnosti vozidla. Typicky se jedná o
            model, motorizaci, typ karoserie či výbavu.
          </li>
          <li>
            <span className="font-bold">VIS</span> (vehicle indicator section)
            tvoří osm znaků, z nichž poslední čtyři jsou vždy číslice. Tato
            sekce slouží ve spojení s ostatními částmi VIN k identifikaci
            konkrétního vozidla. Nevyužitá místa jsou vyplněna číslicí 0.
          </li>
        </ul>

        <h2 className="self-start pt-8 pb-4 text-3xl">Zdrojová data</h2>
        <p>
          Datová sada registru vozidel pochází z webu Ministerstva dopravy ČR
          (MDČR){" "}
          <a href="https://www.dataovozidlech.cz" target="_blank">
            Datová kostka
          </a>
          . Data zde lze procházet přímo ve webovém prohlížeči, anebo si vyžádat
          export databáze ve formátu CSV. Získaná data jsou anonymizovaná, takže
          neobsahují např. informaci o majiteli vozu nebo jeho aktuální SPZ.
          Datová sada obsahuje informace podobné technickému průkazu:
        </p>
        <ul className="pt-4 pl-6 list-disc">
          <li>VIN kód;</li>
          <li>Rok výroby, datum první registrace celkově a v rámci ČR;</li>
          <li>
            Druh vozidla (např. osobní automobil a poddruh jako hatchback či
            sedan);
          </li>
          <li>Tovární značka a obchodní označení (značka a model vozu);</li>
          <li>
            Stav vozidla (jestli je provozované, zaniklé či třeba vyvezené);
          </li>
          <li>
            Stav prohlídky (jaký byl výsledek poslední technické kontroly);
          </li>
          <li>
            Technické parametry (barva, motor, spojovací zařízení, ráfky a
            pneumatiky, emise atd.).
          </li>
        </ul>

        <p className="pt-4">
          Druhou datovou sadu tvoří seznam všech prohlídek na STK uskutečněných
          od 1. 1. 2018. Tato data byla získána od MDČR na základě žádosti o
          poskytnutí informace ve smyslu{" "}
          <a href="https://www.zakonyprolidi.cz/cs/1999-106" target="_blank">
            zákona č. 106/1999 Sb.
          </a>{" "}
          Jedná se o XML soubory poskytované za každý uplynulý měsíc, které opět
          neobsahují žádné osobní údaje o provozovateli. K dispozici jsou ke
          každé kontrole následující atributy:
        </p>
        <ul className="pt-4 pl-6 list-disc">
          <li>VIN kód;</li>
          <li>
            Základní informace o vozidle jako značka a model, částečně kopírují
            obsah registru vozidel;
          </li>
          <li>Datum kontroly;</li>
          <li>Číslo STK;</li>
          <li>Číslo protokolu;</li>
          <li>Druh kontroly (pravidelná, evidenční, silniční apod.);</li>
          <li>
            Výsledek kontroly (způsobilé, částečně způsobilé či nezpůsobilé);
          </li>
          <li>Seznam nalezených závad (jejich kódy).</li>
        </ul>

        <p className="pt-4">
          Aby bylo možné zobrazit detaily ke každé stanici, součástí dat je také
          seznam stanic TK. Ten je k dispozici ke stažení na{" "}
          <a
            href="https://www.mdcr.cz/Dokumenty/Silnicni-doprava/STK/STK-Seznam-STK-dle-kraju?returl=/Dokumenty/Silnicni-doprava/STK"
            target="_blank"
          >
            zde
          </a>{" "}
          na webu MDČR. Ke každé stanici jsou v tomto MS Excel dokumentu uvedeny
          kontaktní údaje a adresa. Z ní pak lze najít zeměpisné souřadnice a
          stanice zobrazit v mapě, kterou najdete v sekci o{" "}
          <Link href="/stations">stanicích</Link>.
        </p>

        <p className="pt-4">
          Aby bylo možné zobrazit <Link href="/defects">číselník závad</Link>, z
          přílohy{" "}
          <a href="https://www.zakonyprolidi.cz/cs/2018-211" target="_blank">
            vyhlášky č. 211/2018 Sb.
          </a>{" "}
          o technických prohlídkách vozidel byla získána tabulka, která obsahuje
          seznam všech kontrolních úkonů. Ty odpovídají svým kódem jednotlivým
          závadám, takže když pomocí vyhledávače v sekci o{" "}
          <Link href="/vehicles">vozidlech</Link> najdete konkrétní vůz, ke
          každé závadě v jeho historii uvidíte i její název a závažnost.
        </p>
      </Container>
    </>
  );
}
