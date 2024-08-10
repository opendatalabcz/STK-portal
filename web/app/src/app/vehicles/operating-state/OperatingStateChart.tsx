"use client";

import useSWR from "swr";
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
import Card from "antd/es/card";
import { red, cyan } from "@ant-design/colors";
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

type OperatingStateData = {
  year: number;
  PROVOZOVANÉ: number;
  "ODHLÁŠENO-CIZINA": number;
  ZÁNIK: number;
  "VYŘAZENO Z PROVOZU": number;
}[];

export default function OperatingStateChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Status vozidel podle data registrace"
      extra={linkToDetails && <a href="/vehicles/operating-state">Více</a>}
    >
      <div className="h-64 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR(
      "/api/vehicles_operating_state",
      async (key) => {
        const res = await fetch(key);
        const data: OperatingStateData = await res.json();
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
            text: "Rok první registrace v ČR",
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Podíl statutů [%]",
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
                ) +
                " %"
              );
            },
          },
        },
      },
    };

    const sums = rawData.map(
      (e) =>
        (e.PROVOZOVANÉ +
          e["VYŘAZENO Z PROVOZU"] +
          e["ODHLÁŠENO-CIZINA"] +
          e.ZÁNIK) /
        99.99
    );

    const data = {
      labels: rawData.map((e) => e.year),
      datasets: [
        {
          label: "Provozované",
          data: rawData.map((e, i) => e.PROVOZOVANÉ / sums[i]),
          backgroundColor: cyan[4],
        },
        {
          label: "Vývoz",
          data: rawData.map((e, i) => e["ODHLÁŠENO-CIZINA"] / sums[i]),
          backgroundColor: cyan[7],
        },
        {
          label: "Vyřazeno z provozu",
          data: rawData.map((e, i) => e["VYŘAZENO Z PROVOZU"] / sums[i]),
          backgroundColor: red[4],
        },
        {
          label: "Zánik",
          data: rawData.map((e, i) => e.ZÁNIK / sums[i]),
          backgroundColor: red[7],
        },
      ],
    };

    return <Bar data={data} options={options}></Bar>;
  }
}
