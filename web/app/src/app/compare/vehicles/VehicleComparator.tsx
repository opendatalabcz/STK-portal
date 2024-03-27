import { Button, Input, Spin } from "antd";
import { useState } from "react";
import Comparison from "./Comparison";

enum ComparatorState {
  ready,
  firstVinNotFound,
  secondVinNotFound,
  bothVinsNotFound,
  loading,
  set,
}

export default function VehicleComparator() {
  const [firstVin, setFirstVin] = useState("SHHFK2760CU023083");
  const [secondVin, setSecondVin] = useState("WAUZZZ4G1CN143262");
  const [comparatorState, setComparatorState] = useState(ComparatorState.ready);

  return (
    <>
      <div className="grid grid-cols-1 pt-4 pb-4 md:grid-cols-11">
        <div className="col-span-5 py-2">
          <Input
            value={firstVin}
            onChange={(e) => setFirstVin(e.target.value)}
            placeholder="VIN prvního vozidla"
          ></Input>
        </div>
        <div className="flex items-center justify-center">vs.</div>
        <div className="col-span-5 py-2">
          <Input
            value={secondVin}
            onChange={(e) => setSecondVin(e.target.value)}
            placeholder="VIN druhého vozidla"
          ></Input>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button type="primary" size="large" onClick={compare}>
          Porovnat vozidla
        </Button>
      </div>

      {comparatorState == ComparatorState.ready && (
        <div className="flex items-center justify-center py-24">
          Výsledky srovnání se zobrazí zde
        </div>
      )}

      {comparatorState == ComparatorState.loading && (
        <div className="flex items-center justify-center py-24">
          <Spin></Spin>
        </div>
      )}

      {comparatorState == ComparatorState.firstVinNotFound && (
        <div className="flex items-center justify-center py-24">
          VIN prvního vozidla nebyl nalezen.
        </div>
      )}

      {comparatorState == ComparatorState.secondVinNotFound && (
        <div className="flex items-center justify-center py-24">
          VIN druhého vozidla nebyl nalezen.
        </div>
      )}

      {comparatorState == ComparatorState.bothVinsNotFound && (
        <div className="flex items-center justify-center py-24">
          VIN žádného z vozidel nebyl nalezen.
        </div>
      )}

      {comparatorState == ComparatorState.set && (
        <Comparison firstVin={firstVin} secondVin={secondVin}></Comparison>
      )}
    </>
  );

  async function compare() {
    const firstRes: {}[] = await (
      await fetch(`/api/vehicles?vin=eq.${firstVin}`)
    ).json();
    const secondRes: {}[] = await (
      await fetch(`/api/vehicles?vin=eq.${secondVin}`)
    ).json();

    if (firstRes.length == 1 && secondRes.length == 1) {
      setComparatorState(ComparatorState.set);
    } else if (firstRes.length == 0 && secondRes.length == 1) {
      setComparatorState(ComparatorState.firstVinNotFound);
    } else if (firstRes.length == 1 && secondRes.length == 0) {
      setComparatorState(ComparatorState.secondVinNotFound);
    } else {
      setComparatorState(ComparatorState.bothVinsNotFound);
    }
  }
}
