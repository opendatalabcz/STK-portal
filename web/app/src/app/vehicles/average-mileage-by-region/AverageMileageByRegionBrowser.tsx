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
        text: "Průměrný nájezd [km]",
      },
      beginAtZero: true,
      max: 200000,
    },
  },
};

export default function AverageMileageByRegionBrowser() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: rawData } = useSWR(
    "/api/vehicles_average_mileage_by_region?order=year.desc",
    async (key) => {
      const res = await fetch(key);
      const data = await res.json();
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card title="Průměrný nájezd OA podle kraje">
        <div className="h-96">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const firstYear = rawData[rawData.length - 1]["year"];
  const lastYear = rawData[0]["year"];

  const selectedRawData: Map<string, number> = new Map(
    Object.entries(rawData[lastYear - (selectedYear ?? lastYear)])
  );

  const year = selectedRawData.get("year");
  const rawCountData = new Map(selectedRawData);
  rawCountData.delete("year");
  const sortedData = Array.from(rawCountData.entries()).sort(
    (a, b) => a[1] - b[1]
  );

  const data = {
    labels: sortedData.map((item) => item[0]),
    datasets: [
      {
        label: `${year}`,
        data: sortedData.map((item) => item[1]),
        axis: "y",
        backgroundColor: red[4],
      },
    ],
  };

  return (
    <Card
      title="Průměrný nájezd OA podle kraje"
      extra={
        <div className="space-x-4">
          <Button
            shape="circle"
            icon={<CaretLeftOutlined />}
            disabled={selectedYear == firstYear}
            onClick={() => {
              if (selectedYear == null) {
                setSelectedYear(lastYear - 1);
              } else {
                if (selectedYear > firstYear) {
                  setSelectedYear(selectedYear - 1);
                }
              }
            }}
          />
          <span>{year}</span>
          <Button
            shape="circle"
            icon={<CaretRightOutlined />}
            disabled={selectedYear == lastYear || selectedYear == null}
            onClick={() => {
              if (selectedYear != null) {
                if (selectedYear < lastYear) {
                  setSelectedYear(selectedYear + 1);
                }
              }
            }}
          />
        </div>
      }
    >
      <div className="h-96">
        <Bar data={data} options={options}></Bar>
      </div>
    </Card>
  );
}
