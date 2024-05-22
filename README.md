# STK Portál

https://stk.opendatalab.cz

Informační portál o vozidlech v ČR a jejich prohlídkách na STK.

STK portál nabízí informace získané na základě dat Ministerstva dopravy ČR, která lze vytěžit pomocí statistických metod a strojového učení.
Dva hlavní datové zdroje, tj. seznam kontrol na STK a registr vozidel, jsou propojitelná na základě VIN kódu, který známe pro každé vozidlo v registru i každou proběhlou kontrolu.
Díky tomu je možné zobrazit historii vozů v ČR a predikovat jejich chování do budoucnosti.

Projekt se skládá z datové pipeline, která provádí příjem dat a jejich následnou analýzu.
Data jsou uložena do databáze PostgreSQL a API server PostgREST je následně zpřístupňuje frontendu.
Ten je tvořený jako webová aplikace v Next.js.

## Datová pipeline

### Příprava

V `.env` souboru nastavíme cesty k potřebným zdrojovým souborům, v příkladovém `.env.example` se jedná o položky v sekci "Pipeline configuration".

Do adresáře definovaného hodnotou `PRECOMPUTED_DATA` vložíme parametry modelů pro predikci závad a nájezdu, podle `.env.example` se jedná o cestu `./data/precomputed`.
Parametry lze získat natrénováním modelů v Jupyter notebooku v příslušném adresáři pod `data/analysis/vehicles`.

### Doplnění dat

Zdrojové soubory umístíme na cesty definované pod "Pipeline configuration" v `.env`.

V případě datové sady prohlídek na STK pod cestu nastavenou v `.env` vkládáme soubory za jednotlivé měsíce do podadresářů pojmenovaných podle roku, každý soubor má tedy cestu ve tvaru `YYYY/Data_Prohlidek_YYYY_MM.xml`, jméno souboru je nutné také dodržet v tomto formátu.

### Spuštění

V `docker-compose.yml` nastavíme zpracování požadovaných zdrojových dat.
Pokud jsme např. pouze doplnili data prohlídek, zakomentujeme v oddílu `services: data: environment` řádky začínající `DEFECTS_SOURCE`, `STATIONS_SOURCE` a `VEHICLES_SOURCE`, aby se tyto ostatní datové sady zbytečně neimportovaly znovu.

Pipeline pak spustíme jednorázově pomocí

```
docker compose up data
```

Po dokončení importu a přepočítání veškerých analytických výstupů se kontejner zastaví.
