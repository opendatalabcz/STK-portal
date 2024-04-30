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
import { red } from "@ant-design/colors";
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

export type DefectCountData = {
  year: number;
  defect_code: string;
  defect_description: string;
  count: number;
};

export default function TopDefectsLatestYearChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    `/api/stations_defect_counts?year=eq.${latestYear}&order=count.desc&limit=10`,
    async (key) => {
      const res = await fetch(key);
      const data: DefectCountData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card
        size="small"
        title="Nejčastější závady"
        extra={linkToDetails && <a href="/stations/top-defects">Více</a>}
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
          text: "Počet výskytů závady",
        },
        stacked: true,
        beginAtZero: true,
      },
      y: {
        stacked: true,
        ticks: {
          // @ts-ignore
          callback: function (value, index, ticks) {
            // @ts-ignore
            return this.getLabelForValue(value).substring(0, 16) + "...";
          },
        },
      },
    },
  };

  const data = {
    labels: rawData.map((item) => item.defect_description),
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
      title={`Nejčastější závady (${latestYear})`}
      extra={linkToDetails && <a href="/stations/top-defects">Více</a>}
    >
      <div className="h-64 md:h-96">
        <Bar data={data} options={options}></Bar>
      </div>
    </Card>
  );
}
