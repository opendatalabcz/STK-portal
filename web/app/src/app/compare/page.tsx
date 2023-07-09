import Button from "@/components/Button";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import { Rubik } from "next/font/google";

const rubik = Rubik({ subsets: ["latin"] });

export default function ComparePage() {
  return (
    <main className="flex flex-col items-stretch p-4 space-y-4">
      <h1 className={`${rubik.className} text-4xl py-2`}>Srovnání vozidel</h1>

      <p>
        Srovnávač vozidel umožňuje porovnat buď jednotlivá vozidla podle VIN,
        nebo obecně značky a modely.
      </p>

      <div className="flex flex-col space-y-4 items-left">
        <input
          type="text"
          className="p-2 h-12 rounded border-2 outline-none md:w-96 focus:border-red-600 focus:bg-red-50 hover:border-red-600"
          placeholder="Model, značka nebo VIN"
          autoFocus
        ></input>
        <div className="space-x-4">
          <input
            type="text"
            className="p-2 h-12 rounded border-2 outline-none md:w-96 focus:border-red-600 focus:bg-red-50 hover:border-red-600"
            placeholder="Model, značka nebo VIN"
            autoFocus
          ></input>
          <Button>Přidat srovnání</Button>
        </div>
        <div>
          <PrimaryButton>Porovnat vozidla</PrimaryButton>
        </div>

        <h2 className={`${rubik.className} text-3xl pt-4`}>Výsledky</h2>

        <Card>Výsledek 1</Card>
        <Card>Výsledek 2</Card>
        <Card>Výsledek 3</Card>
      </div>
    </main>
  );
}
