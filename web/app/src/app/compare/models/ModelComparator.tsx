import { Button, Input, Spin } from "antd";
import ModelInput from "./ModelInput";
import { useState } from "react";
import MakeInput from "./MakeInput";
import Comparison from "./Comparison";

enum ComparatorState {
  ready,
  set,
}

export default function ModelComparator() {
  // const [firstMake, setFirstMake] = useState<string | undefined>(undefined);
  // const [firstModel, setFirstModel] = useState<string | undefined>(undefined);
  // const [secondMake, setSecondMake] = useState<string | undefined>(undefined);
  // const [secondModel, setSecondModel] = useState<string | undefined>(undefined);
  const [firstMake, setFirstMake] = useState<string | undefined>("AUDI");
  const [firstModel, setFirstModel] = useState<string | undefined>("A6");
  const [secondMake, setSecondMake] = useState<string | undefined>("HONDA");
  const [secondModel, setSecondModel] = useState<string | undefined>("CIVIC");
  const [comparatorState, setComparatorState] = useState(ComparatorState.ready);

  return (
    <>
      <p>
        Vyhledejte nejprve značku a následně model. Vyhledávání funguje na
        základě dat zadávaných při kontrolách na STK, takže někdy obsahuje i
        nesmyslné údaje. Navíc např. většina Volkswagenů je evidována pod
        značkou &quot;VW&quot;, mnohem menší počet je veden jako
        &quot;VOLKSWAGEN&quot;.
      </p>
      <p className="pt-4">
        Srovnávač proto zobrazuje i počet porovnávaných vozidel ve vzorku. Pokud
        je tento počet podezřele malý, zkuste zadat jinou variantu značky či
        modelu. Tento problém lze také odhalit tak, že pro danou značku
        vyhledávač nenabízí některé její modely.
      </p>

      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
        <MakeInput
          value={firstMake}
          onChange={(make) => {
            setComparatorState(ComparatorState.ready);
            setFirstMake(make);
          }}
        ></MakeInput>
        <ModelInput
          make={firstMake}
          value={firstModel}
          onChange={(model) => {
            setComparatorState(ComparatorState.ready);
            setFirstModel(model);
          }}
        ></ModelInput>
      </div>

      <div className="flex justify-center ">vs.</div>

      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
        <MakeInput
          value={secondMake}
          onChange={(make) => {
            setComparatorState(ComparatorState.ready);
            setSecondMake(make);
          }}
        ></MakeInput>
        <ModelInput
          make={secondMake}
          value={secondModel}
          onChange={(model) => {
            setComparatorState(ComparatorState.ready);
            setSecondModel(model);
          }}
        ></ModelInput>
      </div>
      <div className="flex justify-center pt-4">
        <Button
          type="primary"
          size="large"
          onClick={(_) => {
            if (
              firstMake != undefined &&
              firstModel != undefined &&
              secondMake != undefined &&
              secondModel != undefined
            ) {
              setComparatorState(ComparatorState.set);
            }
          }}
        >
          Porovnat modely
        </Button>
      </div>

      {comparatorState == ComparatorState.ready && (
        <div className="flex items-center justify-center py-24">
          Výsledky srovnání se zobrazí zde
        </div>
      )}

      {comparatorState == ComparatorState.set && (
        <Comparison
          firstMake={firstMake!}
          firstModel={firstModel!}
          secondMake={secondMake!}
          secondModel={secondModel!}
        ></Comparison>
      )}
    </>
  );
}
