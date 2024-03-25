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

type TotalAnomalousInspectionsHistogramData = {
  thousandths: number;
  count: number;
};

export default function AnomalousInspectionsChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    `/api/stations_total_anomalies_by_station_histogram?order=thousandths.asc`,
    async (key) => {
      const res = await fetch(key);
      const data: TotalAnomalousInspectionsHistogramData[] = await res.json();
      return data;
    }
  );

  return (
    <Card
      size="small"
      title="Histogram podílu všech anomálních prohlídek"
      extra={
        linkToDetails && <a href="/stations/anomalous-inspections">Více</a>
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
          offset: 0.1,
          grid: {
            offset: true,
          },
          ticks: {
            stepSize: 0.1,
          },
          title: {
            display: true,
            text: "Podíl anomálních prohlídek [%]",
            font: {
              size: 14,
            },
          },
        },
        beginAtZero: false,

        y: {
          title: {
            display: true,
            text: "Počet stanic",
          },
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
              return `Podíl anomálií: ${Intl.NumberFormat("cs-CZ", {
                maximumFractionDigits: 1,
              }).format(x)} - ${Intl.NumberFormat("cs-CZ", {
                maximumFractionDigits: 1,
              }).format(x + 0.1)} %`;
            },
          },
        },
      },
    };

    const data = {
      labels: rawData.map((e) => e.thousandths / 10),
      datasets: [
        {
          label: "Počet anomálií",
          data: rawData.map((e) => e.count),
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