"use client";

import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, Spin } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type AverageAgeData = {
  year: number;
  mean: number;
}[];

export default function AverageAgeChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    "/api/vehicles_changes_in_time_average_age",
    async (key) => {
      const res = await fetch(key);
      const data: AverageAgeData = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <div className="flex items-center justify-center grow">
        <Spin></Spin>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Rok",
        },
      },
      y: {
        title: {
          display: true,
          text: "Věk [roky]",
        },
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: rawData.map((e) => e.year),
    datasets: [
      {
        label: "Průměrný věk",
        data: rawData.map((e) => e.mean),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Card
      size="small"
      title="Průměrný věk osobních automobilů"
      extra={
        linkToDetails && (
          <a href="/vehicles/changes-in-time/average-age">Více</a>
        )
      }
    >
      <div className="h-48 md:h-96">
        <Line data={data} datasetIdKey="average_age" options={options}></Line>
      </div>
    </Card>
  );
}
