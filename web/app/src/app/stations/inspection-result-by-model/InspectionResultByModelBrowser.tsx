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
import { cyan, red } from "@ant-design/colors";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { firstInspectionYear, latestYear } from "@/years";
import { InspectionSuccessData } from "./InspectionResultByTopModel";

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

export default function InspectionResultByModelBrowser() {
  const [selectedYear, setSelectedYear] = useState<number>(latestYear);

  const { data: rawData } = useSWR(
    `/api/stations_inspection_success_by_model?year=eq.${selectedYear}&order=total.desc&limit=50`,
    async (key) => {
      const res = await fetch(key);
      const data: InspectionSuccessData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card title="Poměrný výsledek populárních modelů">
        <div className="h-[30rem]">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const year = rawData[0].year;

  const data = {
    labels: rawData.map((item) => item.model),
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
      title="Poměrný výsledek populárních modelů"
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
      <div className="h-[65rem]">
        <Bar data={data} options={options}></Bar>
      </div>
    </Card>
  );
}
