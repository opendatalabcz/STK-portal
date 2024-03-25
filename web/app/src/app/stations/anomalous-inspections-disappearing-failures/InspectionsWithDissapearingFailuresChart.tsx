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
import { Card } from "antd";
import { cyan } from "@ant-design/colors";
import useSWR from "swr";
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

type InspectionsWithDissapearingFailuresHistogramData = {
  tens: number;
  count: number;
};

export default function InspectionsWithDissapearingFailuresChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
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
    <Card
      size="small"
      title="Histogram prohlídek s mizejícími závadami"
      extra={
        linkToDetails && (
          <a href="/stations/anomalous-inspections-disappearing-failures">
            Více
          </a>
        )
      }
    >
      <div className="h-64 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    if (rawData == undefined) {
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
          backgroundColor: cyan[5],
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
