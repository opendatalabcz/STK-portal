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
import { geekblue, gold, green, red } from "@ant-design/colors";
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
      title="Poměrný nájezd podle typu pohonu"
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
            text: "Poměrný nájezd dle pohonu [%]",
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

    const data = {
      labels: rawData.map((e) => e.year),
      datasets: [
        {
          label: "Benzin",
          data: rawData.map((e, i) => e.benzin * 99.9),
          backgroundColor: green[6],
        },
        {
          label: "Nafta",
          data: rawData.map((e, i) => e.nafta * 99.9),
          backgroundColor: red[4],
        },
        {
          label: "Elektrifikované",
          data: rawData.map((e, i) => e.elektrifikovane * 99.9),
          backgroundColor: geekblue[5],
        },

        {
          label: "Plyn (i v kombinaci)",
          data: rawData.map((e, i) => e.plyn * 99.9),
          backgroundColor: gold[7],
        },
        {
          label: "Ostatní",
          data: rawData.map((e, i) => e.ostatni * 99.9),
          backgroundColor: "grey",
        },
      ],
    };

    return <Bar data={data} options={options}></Bar>;
  }
}
