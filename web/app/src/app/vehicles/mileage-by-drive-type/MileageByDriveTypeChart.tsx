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
import Card from "antd/es/card";
import { cyan, grey, red } from "@ant-design/colors";
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
  benzin: number;
  nafta: number;
  elektrifikovane: number;
  plyn: number;
  ostatni: number;
};

export default function MileageByDriveTypeChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Celkový nájezd podle typu pohonu"
      extra={
        linkToDetails && <a href="/vehicles/mileage-by-drive-type">Více</a>
      }
    >
      <div className="h-64 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR(
      "/api/vehicles_mileage_by_drive_type",
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
      barPercentage: 0.95,
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
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
            text: "Celkový nájezd dle pohonu [km]",
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
                " km"
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
          data: rawData.map((e, i) => e.benzin),
          backgroundColor: red[4],
        },
        {
          label: "Nafta",
          data: rawData.map((e, i) => e.nafta),
          backgroundColor: red[7],
        },
        {
          label: "Plyn (i v kombinaci)",
          data: rawData.map((e, i) => e.plyn),
          backgroundColor: cyan[7],
        },
        {
          label: "Elektrifikované",
          data: rawData.map((e, i) => e.elektrifikovane),
          backgroundColor: cyan[4],
        },
        {
          label: "Ostatní",
          data: rawData.map((e, i) => e.ostatni),
          backgroundColor: grey[4],
        },
      ],
    };

    return <Bar data={data} options={options}></Bar>;
  }
}
