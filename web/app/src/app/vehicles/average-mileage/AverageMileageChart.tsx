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
  average_mileage: number;
}[];

export default function AverageMileageChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Průměrný nájezd kontrolovaných OA"
      extra={linkToDetails && <a href="/vehicles/average-mileage">Více</a>}
    >
      <div className="h-48 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR(
      "/api/vehicles_average_mileage",
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
                Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 2 }).format(
                  item.parsed.y
                ) + " km"
              );
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
            text: "Průměrný nájezd [km]",
          },
          beginAtZero: true,
        },
      },
    };

    const data = {
      labels: rawData.map((e) => e.year),
      datasets: [
        {
          label: "Průměrný nájezd",
          data: rawData.map((e) => e.average_mileage),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    return <Line data={data} options={options}></Line>;
  }
}
