"use client";

import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { red } from "@ant-design/colors";
import Card from "antd/es/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type AverageAgeData = {
  year: number;
  mean: number;
}[];

export default function AverageAgeChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Průměrný věk osobních automobilů (OA)"
      extra={linkToDetails && <a href="/vehicles/average-age">Více</a>}
    >
      <div className="h-48 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR(
      "/api/vehicles_average_age",
      async (key) => {
        const res = await fetch(key);
        const data: AverageAgeData = await res.json();
        return data;
      }
    );

    if (rawData == undefined) {
      return <ChartPlaceholder></ChartPlaceholder>;
    }

    const options = {
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
              return Intl.NumberFormat("cs-CZ", {
                maximumFractionDigits: 2,
              }).format(item.parsed.y);
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Rok",
          },
        },
        y: {
          title: {
            display: true,
            text: "Průměrné stáří [roky]",
          },
          beginAtZero: true,
        },
      },
    };

    const data = {
      labels: rawData.map((e) => e.year),
      datasets: [
        {
          label: "Průměrné stáří",
          data: rawData.map((e) => e.mean),
          borderColor: red[4],
          backgroundColor: red[3],
        },
      ],
    };

    return <Line data={data} options={options}></Line>;
  }
}
