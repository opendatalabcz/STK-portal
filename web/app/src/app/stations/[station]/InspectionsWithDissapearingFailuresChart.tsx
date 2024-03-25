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
import { cyan, red } from "@ant-design/colors";
import useSWR from "swr";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { useState } from "react";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { InspectionsWithDissapearingFailuresData } from "./InspectionsWithDissapearingFailuresDisplay";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type InspectionsWithDissapearingFailuresHistogramData = {
  tens: number;
  count: number;
};

export default function RInspectionsWithDissapearingFailuresChart({
  station,
}: {
  station: string;
}) {
  const { data: thisStationCount } = useSWR(
    `/api/stations_dissapearing_failures_by_station?station_id=eq.${station}`,
    async (key) => {
      const res = await fetch(key);
      const data: InspectionsWithDissapearingFailuresData[] = await res.json();
      return data[0];
    }
  );

  const { data: rawData } = useSWR(
    `/api/stations_dissapearing_failures_by_station_histogram?order=tens.asc`,
    async (key) => {
      const res = await fetch(key);
      const data: InspectionsWithDissapearingFailuresHistogramData[] =
        await res.json();
      return data;
    }
  );

  return (
    <Card size="small" title="Histogram anomálních prohlídek">
      <div className="h-64">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    if (rawData == undefined || thisStationCount == undefined) {
      return <ChartPlaceholder></ChartPlaceholder>;
    }

    const options = {
      barPercentage: 1.15,
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          type: "linear",
          offset: 5,
          grid: {
            offset: true,
          },
          ticks: {
            stepSize: 10,
          },
          title: {
            display: true,
            text: "Počet anomálních prohlídek",
            font: {
              size: 14,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: "Počet stanic",
          },
          // beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            // @ts-ignore
            label: (item) => {
              return (
                "Počet stanic v tomto rozsahu: " +
                Intl.NumberFormat("cs-CZ", {
                  maximumFractionDigits: 2,
                }).format(item.parsed.y)
              );
            },
            // @ts-ignore
            title: (items) => {
              if (!items.length) {
                return "";
              }
              const item = items[0];
              const x = item.parsed.x;
              return `Počet anomálií: ${x} - ${x + 10}`;
            },
          },
        },
      },
    };

    const data = {
      labels: rawData.map((e) => e.tens * 10),
      datasets: [
        {
          label: "Počet anomálií",
          data: rawData.map((e, i) => e.count),
          // @ts-ignore
          backgroundColor: (ctx) => {
            if (
              thisStationCount.count + 5 <= ctx.parsed.x ||
              thisStationCount.count - 5 > ctx.parsed.x
            ) {
              return cyan[5];
            } else {
              return cyan[7];
            }
          },
          borderWidth: 1,
          barPercentage: 1,
          categoryPercentage: 1,
        },
      ],
    };

    // @ts-ignore
    return <Bar data={data} options={options}></Bar>;
  }
}
