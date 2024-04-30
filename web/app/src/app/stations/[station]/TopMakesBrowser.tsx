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
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { useState } from "react";
import { red } from "@ant-design/colors";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { firstInspectionYear, latestYear } from "@/years";
import Card from "antd/es/card";
import Button from "antd/es/button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type TopMakesData = {
  station_id: string;
  make: string;
  count: number;
};

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
            Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(
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
        text: "Počet kontrolovaných vozidel",
      },
      beginAtZero: true,
    },
  },
};

export default function TopMakesBrowser({ station }: { station: string }) {
  const [selectedYear, setSelectedYear] = useState<number>(latestYear);

  const { data: rawData } = useSWR(
    `/api/stations_top_makes_by_station?station_id=eq.${station}&year=eq.${selectedYear}&order=count.desc&limit=10`,
    async (key) => {
      const res = await fetch(key);
      const data: TopMakesData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card title="Nejčastěji kontrolované značky za rok" size="small">
        <div className="h-[30rem]">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const data = {
    labels: rawData.map((item) => item.make),
    datasets: [
      {
        label: selectedYear.toString(),
        data: rawData.map((item) => item.count),
        axis: "y",
        backgroundColor: red[4],
      },
    ],
  };

  return (
    <Card
      title="Nejčastěji kontrolované značky za rok"
      size="small"
      extra={
        <div className="space-x-4">
          <Button
            shape="circle"
            icon={<CaretLeftOutlined />}
            disabled={selectedYear == firstInspectionYear}
            onClick={() => {
              if (selectedYear > firstInspectionYear) {
                setSelectedYear(selectedYear - 1);
              }
            }}
          />
          <span>{selectedYear}</span>
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
