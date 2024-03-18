import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import InspectionResultByModelBrowser from "./InspectionResultByModelBrowser";

export default function InspectionResultByMakePage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            {
              title: (
                <Link href="/stations">Stanice (souhrnné statistiky)</Link>
              ),
            },
            { title: "Poměrný výsledek prohlídek populárních modelů" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <InspectionResultByModelBrowser></InspectionResultByModelBrowser>

          <p>
            Graf zobrazuje percentuální podíl výsledků všech kontrol daného
            modelu v daném roce. Zobrazeny jsou pouze podíly nezpůsobilého a
            částečně způsobilého výsledku, zbytek do 100 % tvoří úspěšné
            kontroly. Čím menší jsou tedy oba sloupce dohromady, tím více
            vozidel daného modelu prošlo STK úspěšně.
          </p>

          <p>
            Je třeba při odvozování kvality modelů pamatovat na to, že
            "úspěšnější" modely mohou být poměrně nové (např. Škoda Rapid a
            další novější modely), takže se na kontrolách ještě nemohlo stihnout
            projevit mnoho závad. Naopak modely, které se dnes již nevyrábí,
            budou mít zpravidla horší úspěšnost, protože všechna vozidla těchto
            modelů jsou mnohem starší a s věkem závad obecně přibývá.
          </p>

          <p>
            Problém pak může nastat ve chvíli, kdy se jeden model vyrábí ve více
            generacích. Tyto generace nejsou bohužel z dostupných dat mnohdy
            rozlišitelné, takže se v takových sloupcích míchají stará vozidla s
            novými (např. Škoda Octavia).
          </p>
        </div>
      </Container>
    </>
  );
}
