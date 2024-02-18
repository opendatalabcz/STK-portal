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
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "antd";
import {
  geekblue,
  gold,
  green,
  orange,
  purple,
  red,
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
  ORANŽOVÁ: number;
  ŠEDÁ: number;
  ŽLUTÁ: number;
  MODRÁ: number;
  ČERNÁ: number;
  ZELENÁ: number;
  BÍLÁ: number;
  ČERVENÁ: number;
  FIALOVÁ: number;
  HNĚDÁ: number;
}[];

export default function ColorsChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  return (
    <Card
      size="small"
      title="Podíl barev nově registrovaných vozidel"
      extra={linkToDetails && <a href="/vehicles/colors">Více</a>}
    >
      <div className="h-64 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: rawData } = useSWR("/api/vehicles_colors", async (key) => {
      const res = await fetch(key);
      const data: ColorsData = await res.json();
      return data;
    });

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
            text: "Podíl barev [%]",
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
        (e.BÍLÁ +
          e.FIALOVÁ +
          e.HNĚDÁ +
          e.MODRÁ +
          e.ORANŽOVÁ +
          e.ZELENÁ +
          e.ČERNÁ +
          e.ČERVENÁ +
          e.ŠEDÁ +
          e.ŽLUTÁ) /
        99.99
    );

    const data = {
      labels: rawData.map((e) => e.year),
      datasets: [
        {
          label: "Fialová",
          data: rawData.map((e, i) => e.FIALOVÁ / sums[i]),
          backgroundColor: purple[4],
        },
        {
          label: "Červená",
          data: rawData.map((e, i) => e.ČERVENÁ / sums[i]),
          backgroundColor: red[4],
        },
        {
          label: "Hnědá",
          data: rawData.map((e, i) => e.HNĚDÁ / sums[i]),
          backgroundColor: gold[7],
        },
        {
          label: "Oranžová",
          data: rawData.map((e, i) => e.ORANŽOVÁ / sums[i]),
          backgroundColor: orange[4],
        },
        {
          label: "Žlutá",
          data: rawData.map((e, i) => e.ŽLUTÁ / sums[i]),
          backgroundColor: yellow[4],
        },
        {
          label: "Zelená",
          data: rawData.map((e, i) => e.ZELENÁ / sums[i]),
          backgroundColor: green[6],
        },

        {
          label: "Modrá",
          data: rawData.map((e, i) => e.MODRÁ / sums[i]),
          backgroundColor: geekblue[5],
        },
        {
          label: "Bílá",
          data: rawData.map((e, i) => e.BÍLÁ / sums[i]),
          backgroundColor: "rgb(240, 240, 240)",
        },
        {
          label: "Šedá",
          data: rawData.map((e, i) => e.ŠEDÁ / sums[i]),
          backgroundColor: "grey",
        },
        {
          label: "Černá",
          data: rawData.map((e, i) => e.ČERNÁ / sums[i]),
          backgroundColor: "rgb(0, 0, 0)",
        },
      ],
    };

    return <Bar data={data} options={options}></Bar>;
  }
}
