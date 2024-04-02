import DefectsBySeverityAgeDriveTypeChart from "./DefectsBySeverityAgeDriveTypeChart";
import DefectsBySeverityAgeDriveTypeMediumChart from "./DefectsBySeverityAgeDriveTypeMediumChart ";
import DefectsBySeverityAgeDriveTypeSevereChart from "./DefectsBySeverityAgeDriveTypeSevereChart";
import InspectionSuccessByAgeChart from "./InspectionSuccessByAgeChart";
import MileageByAgeChart from "./MileageByAgeChart";
import MotorsTable from "./MotorsTable";
import VehicleCounter from "./VehicleCounter";
import VehicleCounterActive from "./VehicleCounterActive";

export default function Comparison({
  firstMake,
  firstModel,
  secondMake,
  secondModel,
}: {
  firstMake: string;
  firstModel: string;
  secondMake: string;
  secondModel: string;
}) {
  return (
    <>
      <h2 className="pt-8 text-2xl">Počet vozidel v registru</h2>
      <hr></hr>
      <div className="grid grid-cols-2 py-4 gap-x-4 gap-y-2">
        <VehicleCounter make={firstMake} model={firstModel}></VehicleCounter>
        <VehicleCounter make={secondMake} model={secondModel}></VehicleCounter>
        <VehicleCounterActive
          make={firstMake}
          model={firstModel}
        ></VehicleCounterActive>
        <VehicleCounterActive
          make={secondMake}
          model={secondModel}
        ></VehicleCounterActive>
      </div>

      <h2 className="pt-4 text-2xl">Průměrný nájezd podle stáří</h2>
      <hr></hr>
      <div className="pt-4 space-y-4">
        <p>
          Průměrný nájezd je vypočítán jako průměr nájezdů na všech prohlídkách
          vozidla daného věku. Protože vozidel do 4 let věku a stejně tak i
          velmi starých vozidel je zpravidla na prohlídkách málo, začátek a
          chvost grafu nelze považovat za průkazný &ndash; průměr je zde
          zpravidla tvořen velmi málo vzorky.
        </p>
        <MileageByAgeChart
          firstMake={firstMake}
          firstModel={firstModel}
          secondMake={secondMake}
          secondModel={secondModel}
        ></MileageByAgeChart>
      </div>

      <h2 className="pt-8 text-2xl">Motorizace</h2>
      <hr></hr>
      <p className="py-4">
        Seznam motorizací pro oba modely obsahuje pro každý typ pohonu rozsah
        objemů a výkonů motorů. Různé motorizace mohou být dostupné v různých
        generacích daného modelu &ndash; jedná se o výčet motorizací, které byly
        někdy registrované v ČR a uvedené v technickém průkazu. Sloupce lze
        řadit a filtrovat např. podle požadovaných dílčích typů pohonu.
      </p>
      <MotorsTable
        firstMake={firstMake}
        firstModel={firstModel}
        secondMake={secondMake}
        secondModel={secondModel}
      ></MotorsTable>

      <h2 className="pt-8 text-2xl">Úspěšnost na STK podle věku</h2>
      <hr></hr>
      <p className="py-4">
        Úspěšnost je vypočítána jako podíl prohlídek se závěrem "způsobilé" a
        všech prohlídek vozidla daného věku zaokrouhleného na celé roky. Protože
        vozidel do 4 let věku a stejně tak i velmi starých vozidel je zpravidla
        na prohlídkách málo, začátek a chvost grafu je třeba opět brát s
        rezervou &ndash; výsledek je zde zpravidla tvořen velmi málo vzorky.
      </p>
      <InspectionSuccessByAgeChart
        firstMake={firstMake}
        firstModel={firstModel}
        secondMake={secondMake}
        secondModel={secondModel}
      ></InspectionSuccessByAgeChart>

      <h2 className="pt-8 text-2xl">Počet závad podle závažnosti</h2>
      <hr></hr>
      <div className="py-4 space-y-4">
        <p>
          Grafy zobrazují průměrný počet závad na každé prohlídce vozidel daného
          modelu podle jejich závažnosti. Stejně jako pro předchozí grafy platí,
          že počáteční a koncové hodnoty jsou tvořeny malým počtem vzorků a
          nelze je považovat za průkazné.
        </p>
        <DefectsBySeverityAgeDriveTypeChart
          firstMake={firstMake}
          firstModel={firstModel}
          secondMake={secondMake}
          secondModel={secondModel}
        ></DefectsBySeverityAgeDriveTypeChart>
        <DefectsBySeverityAgeDriveTypeMediumChart
          firstMake={firstMake}
          firstModel={firstModel}
          secondMake={secondMake}
          secondModel={secondModel}
        ></DefectsBySeverityAgeDriveTypeMediumChart>
        <DefectsBySeverityAgeDriveTypeSevereChart
          firstMake={firstMake}
          firstModel={firstModel}
          secondMake={secondMake}
          secondModel={secondModel}
        ></DefectsBySeverityAgeDriveTypeSevereChart>
      </div>
    </>
  );
}
