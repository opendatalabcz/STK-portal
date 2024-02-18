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
import { geekblue, green, red } from "@ant-design/colors";
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

type DriveTypeData = {
  year: number;
  elektropohon: number;
  nafta_hybrid: number;
  benzin_hybrid: number;
};

export default function ElectricDriveTypeChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Elektrifikace nově registrovaných vozidel"
      extra={linkToDetails && <a href="/vehicles/electric-drive-type">Více</a>}
    >
      <div className="h-64 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR(
      "/api/vehicles_electric_drive_type?year=gte.2010",
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
            text: "Počet vozidel dle pohonu",
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
          label: "Elektropohon",
          data: rawData.map((e, i) => e.elektropohon),
          backgroundColor: geekblue[5],
        },
        {
          label: "Benzin hybrid",
          data: rawData.map((e, i) => e.benzin_hybrid),
          backgroundColor: green[6],
        },
        {
          label: "Nafta hybrid",
          data: rawData.map((e, i) => e.nafta_hybrid),
          backgroundColor: red[4],
        },
      ],
    };

    return <Bar data={data} options={options}></Bar>;
  }
}
