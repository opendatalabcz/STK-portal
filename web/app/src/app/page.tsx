import NumberBox from "@/components/NumberBox";

export default function Home() {
  return (
    <main className="flex flex-col items-center mx-auto my-4 space-y-8 max-w-screen-lg">
      <p>
        Vítejte na STK portálu. Naleznete zde informace o stanicích technické
        kontroly, detaily o vozidlech v ČR, statistiky vozového parku a
        prohlídek na STK. Portál nabízí také průvodce výběrem auta. To vše na
        základě dat z registru silničních vozidel a záznamů o prohlídkách na STK
        zveřejněných MDČR (a případnými dalšími subjekty...)
      </p>
      <div className="flex space-x-4">
        <NumberBox value="17 489 816" title="Vozidel v registru" />
        <NumberBox value="383" title="Stanic technické kontroly" />
        <NumberBox value="19 833 286" title="Kontrol na STK" />
        <NumberBox value="2018&ndash;2022" title="Rozsah záznamů kontrol" />
      </div>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          className="p-2 h-12 rounded border-2 outline-none md:w-96 focus:border-red-600 focus:bg-red-50"
          placeholder="Hledejte VIN nebo stanici TK"
          autoFocus
        ></input>
        <div className="flex items-stretch space-x-4">
          <button
            type="button"
            className="px-4 h-12 text-white bg-red-500 rounded border-2 border-red-600 outline-none grow focus:border-red-600 focus:bg-red-600 hover:border-red-600 hover:bg-red-600"
          >
            Naskenovat VIN
          </button>
          <button
            type="button"
            className="px-4 h-12 rounded border-2 outline-none grow focus:border-red-600 focus:bg-red-100 focus:text-red-600 hover:border-red-600 hover:bg-red-100"
          >
            Hledat
          </button>
        </div>
      </div>
    </main>
  );
}
