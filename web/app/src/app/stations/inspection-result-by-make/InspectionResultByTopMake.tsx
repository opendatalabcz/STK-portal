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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type InspectionSuccessData = {
  year: number;
  make: string;
  0: number;
  1: number;
  2: number;
  total: number;
};

export default function InspectionResultByTopMake({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    "/api/stations_inspection_success_by_make?order=year.desc,total.desc&limit=10",
    async (key) => {
      const res = await fetch(key);
      const data: InspectionSuccessData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card
        size="small"
        title="Poměrný výsledek populárních značek"
        extra={
          linkToDetails && (
            <a href="/stations/inspection-result-by-make">Více</a>
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
              Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 2 }).format(
                item.parsed.x
              ) +
              " %"
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
          text: "Poměr výsledku prohlídky [%]",
        },
        stacked: true,
        beginAtZero: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const year = rawData[0].year;

  const data = {
    labels: rawData.map((item) => item.make),
    datasets: [
      {
        label: "Nezpůsobilé",
        data: rawData.map(
          (item) => (item[2] * 100) / (item[0] + item[1] + item[2] + 0.001)
        ),
        axis: "y",
        backgroundColor: red[4],
      },
      {
        label: "Částečně zp.",
        data: rawData.map(
          (item) => (item[1] * 100) / (item[0] + item[1] + item[2] + 0.001)
        ),
        axis: "y",
        backgroundColor: cyan[7],
      },
    ],
  };

  return (
    <Card
      size="small"
      title={`Poměrný výsledek populárních značek (${year})`}
      extra={
        linkToDetails && <a href="/stations/inspection-result-by-make">Více</a>
      }
    >
      <div className="h-64 md:h-96">
        <Bar data={data} options={options}></Bar>
      </div>
    </Card>
  );
}
