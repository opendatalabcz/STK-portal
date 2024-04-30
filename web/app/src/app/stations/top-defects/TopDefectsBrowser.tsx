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
import { cyan, red } from "@ant-design/colors";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { firstInspectionYear, latestYear } from "@/years";
import { DefectCountData } from "./TopDefectsLatestYearChart";
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
        text: "Počet výskytů závady",
      },
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

export default function TopDefectsBrowser() {
  const [selectedYear, setSelectedYear] = useState<number>(latestYear);

  const { data: rawData } = useSWR(
    `/api/stations_defect_counts?year=eq.${selectedYear}&order=count.desc&limit=30`,
    async (key) => {
      const res = await fetch(key);
      const data: DefectCountData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card title="Počet závad podle kategorie">
        <div className="h-[30rem]">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const data = {
    labels: rawData.map((item) => item.defect_description),
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
      title="Počet závad podle kategorie"
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
      <div className="h-[45rem]">
        <Bar data={data} options={options}></Bar>
      </div>
    </Card>
  );
}
