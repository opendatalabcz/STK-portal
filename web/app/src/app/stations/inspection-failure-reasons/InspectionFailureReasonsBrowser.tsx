"use client";

import { Button, Card } from "antd";
import useSWR from "swr";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { firstInspectionWithDefectsYear, latestYear } from "@/years";

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

export default function InspectionFailureReasonsBrowser({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const [selectedYear, setSelectedYear] = useState<number>(latestYear);

  const { data: rawData } = useSWR(
    `/api/stations_inspection_failure_reasons?year=eq.${selectedYear}&order=total_inspections.desc&limit=10`,
    async (key) => {
      const res = await fetch(key);
      const data: InspectionFailureReasonsData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card title="Nejčastější důvody neúspěšné kontroly">
        <div className="h-64 md:h-96">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const year = rawData[0].year;

  return (
    <Card
      title={`Nejčastější důvody neúspěšné kontroly (${year})`}
      extra={
        <div className="space-x-4">
          <Button
            shape="circle"
            icon={<CaretLeftOutlined />}
            disabled={selectedYear == firstInspectionWithDefectsYear}
            onClick={() => {
              if (selectedYear > firstInspectionWithDefectsYear) {
                setSelectedYear(selectedYear - 1);
              }
            }}
          />
          <span>{year}</span>
          <Button
            shape="circle"
            icon={<CaretRightOutlined />}
            disabled={selectedYear == latestYear}
            onClick={() => {
              if (selectedYear < latestYear) {
                setSelectedYear(selectedYear + 1);
              }
            }}
          />
        </div>
      }
    >
      <div className="space-y-4">
        {rawData.map((item) => (
          <Card key={item.make} title={item.make} size="small">
            <ol className="pl-5 list-decimal">
              <li>
                <a href={`/defects#${item.top1_defect_code}`}>
                  {item.top1_defect_description}
                </a>{" "}
                ({Intl.NumberFormat("cs-CZ").format(item.top1_defect_count)}
                ×)
              </li>
              <li>
                <a href={`/defects#${item.top2_defect_code}`}>
                  {item.top2_defect_description}
                </a>{" "}
                ({Intl.NumberFormat("cs-CZ").format(item.top2_defect_count)}
                ×)
              </li>
              <li>
                <a href={`/defects#${item.top3_defect_code}`}>
                  {item.top3_defect_description}
                </a>{" "}
                ({Intl.NumberFormat("cs-CZ").format(item.top3_defect_count)}
                ×)
              </li>
            </ol>
          </Card>
        ))}
      </div>
    </Card>
  );
}
