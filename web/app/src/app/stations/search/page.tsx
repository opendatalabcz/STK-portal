"use client";

import { Spin } from "antd";
// import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import SearchBox from "../SearchBox";
import SearchResult from "./SearchResult";

export default function StationDetailPage() {
  const query = useSearchParams().get("q");

  const { data, isLoading } = useSWR(
    `/api/stations?or=(id.fts.${query},inspection_types_fts.fts.${query},company.fts.${query},street.fts.${query},postal_code.fts.${query},city.fts.${query},nuts3.fts.${query},emails_fts.fts.${query},phones_fts.fts.${query})`,
    async (key: string) => {
      const res = await fetch(key);
      const data: Station[] = await res.json();
      console.log(data);
      return data;
    }
  );

  if (data && !isLoading) {
    return (
      <>
        {/* <Link
          autoFocus={false}
          href="/stations"
          className="text-primary hover:text-primary focus:text-primary focus:underline hover:underline"
        >
          Zpět
        </Link> */}

        <h1 className="text-3xl">Vyhledávání stanic</h1>

        <SearchBox initialValue={query ?? ""}></SearchBox>

        <div className="space-y-4">
          {data.map((d) => (
            <div>
              <SearchResult station={d}></SearchResult>
            </div>
          ))}
        </div>

        {data.length == 0 && (
          <div>
            Je nám líto, ale na tento dotaz nebyly nalezeny žádné výsledky.
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        <SearchBox initialValue={query ?? ""}></SearchBox>

        <div className="flex items-center justify-center grow">
          <Spin></Spin>
        </div>
      </>
    );
  }
}
