"use client";

import { Breadcrumb, Spin } from "antd";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import SearchBox from "../SearchBox";
import SearchResult from "./SearchResult";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import Link from "next/link";

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

  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/stations">Stanice</Link> },
            { title: "Vyhledávání stanic" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <h1 className="pb-4 text-3xl">Vyhledávání stanic</h1>

        <SearchBox initialValue={query ?? ""}></SearchBox>

        {buildContent()}
      </Container>
    </>
  );

  function buildContent() {
    if (data && !isLoading) {
      return (
        <>
          <div className="pt-4 space-y-4">
            {data.map((d) => (
              <div>
                <SearchResult station={d}></SearchResult>
              </div>
            ))}
          </div>

          {data.length == 0 && (
            <div className="pt-4">
              Je nám líto, ale na tento dotaz nebyly nalezeny žádné výsledky.
            </div>
          )}
        </>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-32 grow">
          <Spin></Spin>
        </div>
      );
    }
  }
}
