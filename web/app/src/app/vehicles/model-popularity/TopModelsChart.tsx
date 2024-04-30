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
import Card from "antd/es/card";
import useSWR from "swr";
import { red } from "@ant-design/colors";
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

export type ModelPopularityData = {
  year: number;
  model: string;
  count: number;
};

export default function TopModelsChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    "/api/vehicles_model_popularity?order=year.desc,count.desc&limit=10",
    async (key) => {
      const res = await fetch(key);
      const data: ModelPopularityData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card
        size="small"
        title="Popularita modelů"
        extra={linkToDetails && <a href="/vehicles/model-popularity">Více</a>}
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
      legend: {
        display: false,
      },
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
          text: "Počet nově registrovaných vozidel",
        },
        beginAtZero: true,
      },
    },
  };

  const year = rawData[0].year;
  const data = {
    labels: rawData.map((item) => item.model),
    datasets: [
      {
        label: `${year}`,
        data: rawData.map((item) => item.count),
        axis: "y",
        backgroundColor: red[4],
      },
    ],
  };

  return (
    <Card
      size="small"
      title={`Popularita modelů (${year})`}
      extra={linkToDetails && <a href="/vehicles/model-popularity">Více</a>}
    >
      <div className="h-64 md:h-96">
        <Bar data={data} options={options}></Bar>
      </div>
    </Card>
  );
}
