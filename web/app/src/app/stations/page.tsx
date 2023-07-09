import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import { Rubik } from "next/font/google";

const rubik = Rubik({ subsets: ["latin"] });

export default function StationsPage() {
  return (
    <main className="flex flex-col items-stretch p-4 space-y-4">
      <h1 className={`${rubik.className} text-4xl py-2`}>Stanice</h1>

      <div className="space-x-4">
        <input
          type="text"
          className="p-2 h-12 rounded border-2 outline-none md:w-96 focus:border-red-600 focus:bg-red-50 hover:border-red-600"
          placeholder="Název, adresa nebo kontakt na STK"
          autoFocus
        ></input>
        <PrimaryButton>Hledat</PrimaryButton>
      </div>

      <Card>
        <div className="items-center h-96">
          <iframe
            className="border-0"
            src="https://en.frame.mapy.cz/s/paducacove"
            width="100%"
            height="100%"
          ></iframe>
        </div>
      </Card>

      <h2 className={`${rubik.className} text-3xl py-2`}>Statistiky</h2>

      <h3 className={`${rubik.className} text-2xl pt-4`}>
        Průměrné výsledky kontrol
      </h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {["1", "2", "3"].map((n) => (
          <Card>Graf {n}</Card>
        ))}
      </div>

      <h3 className={`${rubik.className} text-2xl pt-4`}>Kapacita stanic</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {["1", "2", "3"].map((n) => (
          <Card>Graf {n}</Card>
        ))}
      </div>

      <h3 className={`${rubik.className} text-2xl pt-4`}>Anomální prohlídky</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {["1", "2", "3"].map((n) => (
          <Card>Graf {n}</Card>
        ))}
      </div>
    </main>
  );
}
