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
import { firstInspectionWithDefectsYear, latestYear } from "@/years";
import { AverageInspectionCountBySeverityData } from "./AverageInspectionCountBySeverityChart";

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
  barPercentage: 0.5,
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
            Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 3 }).format(
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
        text: "Průměrný počet nebezpečných závad na prohlídce",
      },
      beginAtZero: true,
      // position: "top",
    },
    // A: {
    //   grid: { display: false },
    //   position: "bottom",
    //   type: "linear",
    //   title: {
    //     display: true,
    //     text: "Průměrný počet nebezpečných závad na prohlídce",
    //   },
    // },
  },
};

export default function AverageSevereInspectionCountBrowser() {
  const [selectedYear, setSelectedYear] = useState<number>(latestYear);

  const { data: rawData } = useSWR(
    `/api/stations_average_inspection_count_by_severity_by_nuts3?year=eq.${selectedYear}`,
    async (key) => {
      const res = await fetch(key);
      const data: AverageInspectionCountBySeverityData[] = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card title="Průměrný počet nebezpečných závad">
        <div className="h-[30rem]">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const year = rawData[0].year;

  const data = {
    labels: rawData.map((item) => item.nuts3),
    datasets: [
      // {
      //   label: "Lehká",
      //   data: rawData.map((item) => item.avg_defects_a),
      //   axis: "y",
      //   backgroundColor: cyan[4],
      // },
      // {
      //   label: "Vážná",
      //   data: rawData.map((item) => item.avg_defects_b),
      //   axis: "y",
      //   backgroundColor: cyan[7],
      // },
      {
        label: "Nebezpečná",
        data: rawData.map((item) => item.avg_defects_c),
        axis: "y",
        backgroundColor: red[4],
      },
    ],
  };

  return (
    <Card
      title="Průměrný počet nebezpečných závad"
      extra={
        <div className="space-x-4">
          <Button
            shape="circle"
            icon={<CaretLeftOutlined />}
            disabled={selectedYear == firstInspectionWithDefectsYear}
            onClick={() => {
              if (selectedYear > firstInspectionWithDefectsYear) {
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
