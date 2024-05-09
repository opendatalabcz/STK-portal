# STK Portál

https://stk.opendatalab.cz

Informační portál o vozidlech v ČR a jejich prohlídkách na STK.

STK portál nabízí informace získané na základě dat Ministerstva dopravy ČR, která lze vytěžit pomocí statistických metod a strojového učení.
Dva hlavní datové zdroje, tj. seznam kontrol na STK a registr vozidel, jsou propojitelná na základě VIN kódu, který známe pro každé vozidlo v registru i každou proběhlou kontrolu.
Díky tomu je možné zobrazit historii vozů v ČR a predikovat jejich chování do budoucnosti.

Projekt se skládá z datové pipeline, která provádí příjem dat a jejich následnou analýzu.
Data jsou uložena do databáze PostgreSQL a API server PostgREST je následně zpřístupňuje frontendu.
Ten je tvořený jako webová aplikace v Next.js.
