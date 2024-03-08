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
import { Card } from "antd";
import useSWR from "swr";
import { cyan, red } from "@ant-design/colors";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { latestYear } from "@/years";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type DefectCountByCategoryData = {
  year: number;
  defect_category: string;
  count: number;
};

interface IStringMap {
  [index: string]: string;
}

export const defectCategoryNames = {
  "0": "Identifikace",
  "1": "Brzdy",
  "2": "Řízení",
  "3": "Výhledy",
  "4": "Světlomety apod.",
  "5": "Nápravy, kola apod.",
  "6": "Podvozek",
  "7": "Jiné",
  "8": "Obtěžování okolí",
  "9": "Dodatky k M2 a M3",
} as IStringMap;

export default function DefectsByCategoryLatestYearChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    `/api/stations_defect_counts_by_category?year=eq.${latestYear}&order=count.desc`,
    async (key) => {
      const res = await fetch(key);
      const data: DefectCountByCategoryData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card
        size="small"
        title="Nejčastější závady podle kategorie"
        extra={
          linkToDetails && <a href="/stations/top-defects-by-category">Více</a>
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
      legend: { display: false },
      tooltip: {
        callbacks: {
          // @ts-ignore
          label: (item) => {
            return (
              item.dataset.label +
              ": " +
              Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 2 }).format(
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
        title: {
          display: true,
          text: "Počet výskytů závad v kategorii",
        },
        stacked: true,
        beginAtZero: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const data = {
    labels: rawData.map((item) => defectCategoryNames[item.defect_category]),
    datasets: [
      {
        label: "2022",
        data: rawData.map((item) => item.count),
        axis: "y",
        backgroundColor: red[4],
      },
    ],
  };

  return (
    <Card
      size="small"
      title={`Nejčastější závady podle kategorie (${latestYear})`}
      extra={
        linkToDetails && <a href="/stations/top-defects-by-category">Více</a>
      }
    >
      <div className="h-64 md:h-96">
        <Bar data={data} options={options}></Bar>
      </div>
    </Card>
  );
}
