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
import { Card } from "antd";
import {
  blue,
  cyan,
  geekblue,
  gold,
  green,
  orange,
  purple,
  red,
  volcano,
  yellow,
} from "@ant-design/colors";
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

type ColorsData = {
  year: number;
  amount_imported: number;
  amount_new: number;
}[];

export default function ImportedVsNewAbsoluteChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Počet nových a importovaných ojetých OA"
      extra={linkToDetails && <a href="/vehicles/imported-vs-new">Více</a>}
    >
      <div className="h-64 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR(
      "/api/vehicles_imported_vs_new",
      async (key) => {
        const res = await fetch(key);
        const data: ColorsData = await res.json();
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
        intersect: true,
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
            text: "Počet automobilů podle původu",
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
                Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(
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
          label: "Nové",
          data: rawData.map((e, i) => e.amount_new),
          backgroundColor: cyan[4],
        },
        {
          label: "Importované ojeté",
          data: rawData.map((e, i) => e.amount_imported),
          backgroundColor: cyan[7],
        },
      ],
    };

    return <Bar data={data} options={options}></Bar>;
  }
}
