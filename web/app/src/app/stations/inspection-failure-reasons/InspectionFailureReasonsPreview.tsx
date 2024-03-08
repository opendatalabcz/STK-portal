"use client";

import { Card } from "antd";
import useSWR from "swr";
import ChartPlaceholder from "@/components/ChartPlaceholder";

export type InspectionFailureReasonsData = {
  year: number;
  make: string;
  top1_defect_code: number;
  top1_defect_description: number;
  top1_defect_count: number;
  top2_defect_code: number;
  top2_defect_description: number;
  top2_defect_count: number;
  top3_defect_code: number;
  top3_defect_description: number;
  top3_defect_count: number;
};

export default function InspectionFailureReasonsPreview({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    "/api/stations_inspection_failure_reasons?order=year.desc,total_inspections.desc&limit=3",
    async (key) => {
      const res = await fetch(key);
      const data: InspectionFailureReasonsData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card
        size="small"
        title="Nejčastější důvody neúspěšné kontroly"
        extra={
          linkToDetails && (
            <a href="/stations/inspection-failure-reasons">Více</a>
          )
        }
      >
        <div className="h-64 md:h-96">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const year = rawData[0].year;

  return (
    <Card
      size="small"
      title={`Nejčastější důvody neúspěšné kontroly (${year})`}
      extra={
        linkToDetails && <a href="/stations/inspection-failure-reasons">Více</a>
      }
    >
      <div className="">
        <Card size="small" title={rawData[0].make}>
          <ol className="pl-5 list-decimal">
            <li>
              {rawData[0].top1_defect_description} (
              {Intl.NumberFormat("cs-CZ").format(rawData[0].top1_defect_count)}
              ×)
            </li>
            <li>
              {rawData[0].top2_defect_description} (
              {Intl.NumberFormat("cs-CZ").format(rawData[0].top2_defect_count)}
              ×)
            </li>
            <li>
              {rawData[0].top3_defect_description} (
              {Intl.NumberFormat("cs-CZ").format(rawData[0].top3_defect_count)}
              ×)
            </li>
          </ol>
        </Card>
        <div className="h-3"></div>
        <Card size="small" title={rawData[1].make}>
          <ol className="pl-5 list-decimal">
            <li>
              {rawData[1].top1_defect_description} (
              {Intl.NumberFormat("cs-CZ").format(rawData[1].top1_defect_count)}
              ×)
            </li>
            <li>...</li>
          </ol>
        </Card>
        <div className="h-2"></div>
        <a href="/stations/inspection-failure-reasons">Další značky a závady</a>
      </div>
    </Card>
  );
}
