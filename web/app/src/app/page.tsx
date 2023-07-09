import Button from "@/components/Button";
import PrimaryButton from "@/components/PrimaryButton";
import NumberBox from "@/components/NumberBox";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4 mx-auto my-4 space-y-8 max-w-screen-lg">
      <p className="leading-relaxed md:w-3/4 xl:w-4/5">
        Vítejte na STK portálu. Naleznete zde informace o stanicích technické
        kontroly, detaily o vozidlech v ČR, statistiky vozového parku a
        prohlídek na STK. Portál nabízí také průvodce výběrem auta. To vše na
        základě dat z registru silničních vozidel a záznamů o prohlídkách na STK
        zveřejněných MDČR (a případnými dalšími subjekty...)
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NumberBox value="17 489 816" title="Vozidel v registru" />
        <NumberBox value="383" title="Stanic technické kontroly" />
        <NumberBox value="19 833 286" title="Kontrol na STK" />
        <NumberBox value="2018&ndash;2022" title="Rozsah záznamů kontrol" />
      </div>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          className="p-2 h-12 rounded border-2 outline-none md:w-96 focus:border-red-600 focus:bg-red-50 hover:border-red-600"
          placeholder="Hledejte VIN nebo stanici TK"
          autoFocus
        ></input>
        <div className="flex items-stretch space-x-4">
          <PrimaryButton>Naskenovat VIN</PrimaryButton>
          <Button>Hledat</Button>
        </div>
      </div>
    </main>
  );
}
