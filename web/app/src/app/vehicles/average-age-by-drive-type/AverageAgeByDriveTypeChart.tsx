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
import { cyan, grey, red } from "@ant-design/colors";
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
  benzin: number;
  nafta: number;
  elektrifikovane: number;
  plyn: number;
  ostatni: number;
}[];

export default function AverageAgeByDriveTypeChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Průměrný věk OA podle typu pohonu"
      extra={
        linkToDetails && <a href="/vehicles/average-age-by-drive-type">Více</a>
      }
    >
      <div className="h-64 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR(
      "/api/vehicles_average_age_by_drive_type",
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
      // plugins: {
      //   legend: {
      //     display: false,
      //   },
      // },
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
          label: "Benzin",
          data: rawData.map((e) => e.benzin),
          backgroundColor: red[4],
          borderColor: red[4],
        },
        {
          label: "Nafta",
          data: rawData.map((e, i) => e.nafta),
          backgroundColor: red[7],
          borderColor: red[7],
        },
        {
          label: "Elektrifikované",
          data: rawData.map((e, i) => e.elektrifikovane),
          backgroundColor: cyan[5],
          borderColor: cyan[5],
        },

        {
          label: "Plyn (i v kombinaci)",
          data: rawData.map((e, i) => e.plyn),
          backgroundColor: cyan[7],
          borderColor: cyan[7],
        },
        {
          label: "Ostatní",
          data: rawData.map((e, i) => e.ostatni),
          backgroundColor: grey[4],
          borderColor: grey[4],
        },
      ],
    };

    return <Line data={data} options={options}></Line>;
  }
}
