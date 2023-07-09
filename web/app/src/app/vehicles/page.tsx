import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import { Rubik } from "next/font/google";

const rubik = Rubik({ subsets: ["latin"] });

export default function VehiclesPage() {
  return (
    <main className="flex flex-col items-stretch p-4 space-y-4">
      <h1 className={`${rubik.className} text-4xl py-2`}>Vozidla</h1>

      <div className="space-x-4">
        <input
          type="text"
          className="p-2 h-12 rounded border-2 outline-none md:w-96 focus:border-red-600 focus:bg-red-50 hover:border-red-600"
          placeholder="VIN, značka, model, rok výroby..."
          autoFocus
        ></input>
        <PrimaryButton>Hledat</PrimaryButton>
      </div>

      <h2 className={`${rubik.className} text-3xl pt-4`}>Statistiky</h2>

      <h3 className={`${rubik.className} text-2xl pt-4`}>
        Proměny vozového parku v čase
      </h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {["1", "2", "3"].map((n) => (
          <Card>Graf {n}</Card>
        ))}
      </div>

      <h3 className={`${rubik.className} text-2xl pt-4`}>Průměrné nájezdy</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {["1", "2", "3"].map((n) => (
          <Card>Graf {n}</Card>
        ))}
      </div>

      <h3 className={`${rubik.className} text-2xl pt-4`}>Ekologie</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {["1", "2", "3"].map((n) => (
          <Card>Graf {n}</Card>
        ))}
      </div>

      <h3 className={`${rubik.className} text-2xl pt-4`}>Migrace</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {["1", "2", "3"].map((n) => (
          <Card>Graf {n}</Card>
        ))}
      </div>
    </main>
  );
}
