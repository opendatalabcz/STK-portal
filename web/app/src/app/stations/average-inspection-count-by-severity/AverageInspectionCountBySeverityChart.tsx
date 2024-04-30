"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";
import { cyan, red } from "@ant-design/colors";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { latestYear } from "@/years";
import Card from "antd/es/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type AverageInspectionCountBySeverityData = {
  year: number;
  nuts3: string;
  avg_defects_a: number;
  avg_defects_b: number;
  avg_defects_c: number;
};

export default function AverageInspectionCountBySeverityChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    `/api/stations_average_inspection_count_by_severity_by_nuts3?year=eq.${latestYear}`,
    async (key) => {
      const res = await fetch(key);
      const data: AverageInspectionCountBySeverityData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card
        size="small"
        title="Průměrný počet závad podle závažnosti"
        extra={
          linkToDetails && (
            <a href="/stations/average-inspection-count-by-severity">Více</a>
          )
        }
      >
        <div className="h-64 md:h-96">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const options = {
    barPercentage: 1.15,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          // @ts-ignore
          label: (item) => {
            return (
              item.dataset.label +
              ": " +
              Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 3 }).format(
                item.parsed.x
              )
            );
          },
        },
      },
    },
    indexAxis: "y" as const,
    scales: {
      x: {
        beginAtZero: true,
        position: "top",
      },
      A: {
        grid: { display: false },
        position: "bottom",
        type: "linear",
        title: {
          display: true,
          text: "Průměrný počet závad na prohlídce",
        },
      },
    },
  };

  const year = rawData[0].year;

  const data = {
    labels: rawData.map((item) => item.nuts3),
    datasets: [
      {
        label: "Lehká",
        data: rawData.map((item) => item.avg_defects_a),
        axis: "y",
        backgroundColor: cyan[4],
      },
      {
        label: "Vážná",
        data: rawData.map((item) => item.avg_defects_b),

        axis: "y",
        backgroundColor: cyan[7],
      },
      {
        label: "Nebezpečná",
        data: rawData.map((item) => item.avg_defects_c),
        axis: "y",
        backgroundColor: red[4],
        xAxisID: "A",
      },
    ],
  };

  return (
    <Card
      size="small"
      title={`Průměrný počet závad podle závažnosti (${year})`}
      extra={
        linkToDetails && (
          <a href="/stations/average-inspection-count-by-severity">Více</a>
        )
      }
    >
      <div className="h-64 md:h-96">
        {
          // @ts-ignore
          <Bar data={data} options={options}></Bar>
        }
      </div>
    </Card>
  );
}
