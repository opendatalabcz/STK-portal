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
import {
  DefectCountByCategoryData,
  defectCategoryNames,
} from "./DefectsByCategoryLatestYearChart";

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
        text: "Počet výskytů závad v kategorii",
      },
      beginAtZero: true,
    },
    y: {
      stacked: true,
    },
  },
};

export default function DefectsByCategoryBrowser() {
  const [selectedYear, setSelectedYear] = useState<number>(latestYear);

  const { data: rawData } = useSWR(
    `/api/stations_defect_counts_by_category?year=eq.${selectedYear}&order=count.desc`,
    async (key) => {
      const res = await fetch(key);
      const data: DefectCountByCategoryData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card title="Nejčastější závady podle kategorie">
        <div className="h-[30rem]">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const data = {
    labels: rawData.map((item) => defectCategoryNames[item.defect_category]),
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
      title="Nejčastější závady podle kategorie"
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
