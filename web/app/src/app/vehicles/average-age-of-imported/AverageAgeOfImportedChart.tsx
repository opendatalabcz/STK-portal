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
import { Card } from "antd";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { cyan } from "@ant-design/colors";

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

export default function AverageAgeOfImportedChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Průměrné stáří ojetin při importu"
      extra={
        linkToDetails && <a href="/vehicles/average-age-of-imported">Více</a>
      }
    >
      <div className="h-48 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR(
      "/api/vehicles_average_age_of_imported",
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
      scales: {
        x: {
          title: {
            display: true,
            text: "Rok první registrace v ČR",
          },
        },
        y: {
          title: {
            display: true,
            text: "Průměrný věk při registraci [roky]",
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
          borderColor: cyan[4],
          backgroundColor: cyan[3],
        },
      ],
    };

    return <Line data={data} options={options}></Line>;
  }
}
