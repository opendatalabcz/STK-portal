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
import { Button, Card } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { useState } from "react";
import { red } from "@ant-design/colors";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { MakePopularityData } from "./TopMakesChart";
import { firstVehiclesYear, latestYear } from "@/years";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

export default function MakePopularityBrowser() {
  const [selectedYear, setSelectedYear] = useState<number>(latestYear);

  const { data: rawData } = useSWR(
    `/api/vehicles_make_popularity?year=eq.${selectedYear}&order=count.desc&limit=20`,
    async (key) => {
      const res = await fetch(key);
      const data: MakePopularityData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card title="Nejčastěji registrované značky za rok">
        <div className="h-[30rem]">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const year = rawData[0].year;

  const data = {
    labels: rawData.map((item) => item.make),
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
      title="Nejčastěji registrované značky za rok"
      extra={
        <div className="space-x-4">
          <Button
            shape="circle"
            icon={<CaretLeftOutlined />}
            disabled={selectedYear == firstVehiclesYear}
            onClick={() => {
              if (selectedYear > firstVehiclesYear) {
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
      <div className="h-[30rem]">
        <Bar data={data} options={options}></Bar>
      </div>
    </Card>
  );
}
