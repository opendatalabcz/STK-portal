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

type DriveTypeData = {
  year: number;
  0: number;
  1: number;
  2: number;
};

export default function TotalInspectionsByResultChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Počet kontrol podle výsledku"
      extra={linkToDetails && <a href="/stations/inspection-by-result">Více</a>}
    >
      <div className="h-64 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR(
      "/api/stations_average_inspection_result",
      async (key) => {
        const res = await fetch(key);
        const data: DriveTypeData[] = await res.json();
        return data;
      }
    );

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
          stacked: true,
          title: {
            display: true,
            text: "Rok",
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Počet prohlídek dle výsledku",
          },
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            // @ts-ignore
            label: (item) => {
              return (
                item.dataset.label +
                ": " +
                Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 2 }).format(
                  item.parsed.y
                )
              );
            },
          },
        },
      },
    };

    const data = {
      labels: rawData.map((e) => e.year),
      datasets: [
        {
          label: "Způsobilé",
          data: rawData.map((e, i) => e[0]),
          backgroundColor: cyan[5],
        },
        {
          label: "Částečně způs.",
          data: rawData.map((e, i) => e[1]),
          backgroundColor: cyan[7],
        },
        {
          label: "Nezpůsobilé",
          data: rawData.map((e, i) => e[2]),
          backgroundColor: red[4],
        },
      ],
    };

    return <Bar data={data} options={options}></Bar>;
  }
}
