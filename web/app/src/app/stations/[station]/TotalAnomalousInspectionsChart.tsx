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
import { cyan, red } from "@ant-design/colors";
import useSWR from "swr";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { TotalAnomalousInspectionsData } from "./TotalAnomalousInspectionsDisplay";
import Card from "antd/es/card";

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

export default function TotalAnomalousInspectionsChart({
  station,
}: {
  station: string;
}) {
  const { data: thisStationCount } = useSWR(
    `/api/stations_total_anomalies_by_station?station_id=eq.${station}`,
    async (key) => {
      const res = await fetch(key);
      const data: TotalAnomalousInspectionsData[] = await res.json();
      return data[0];
    }
  );

  const { data: rawData } = useSWR(
    `/api/stations_total_anomalies_by_station_histogram?order=thousandths.asc`,
    async (key) => {
      const res = await fetch(key);
      const data: TotalAnomalousInspectionsHistogramData[] = await res.json();
      return data;
    }
  );

  return (
    <Card size="small" title="Histogram podílu anomálních prohlídek">
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
          data: rawData.map((e, i) => e.count),
          // @ts-ignore
          backgroundColor: (ctx) => {
            if (
              thisStationCount.ratio * 100 <= ctx.parsed.x ||
              thisStationCount.ratio * 100 - 0.1 > ctx.parsed.x
            ) {
              return red[4];
            } else {
              return cyan[5];
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
