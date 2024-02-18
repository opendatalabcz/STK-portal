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
import useSWR from "swr";
import { red } from "@ant-design/colors";
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

export default function RegionalAverageMileageChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    "/api/vehicles_average_mileage_by_region?order=year.desc&limit=1",
    async (key) => {
      const res = await fetch(key);
      const data: Map<string, number> = new Map(
        Object.entries((await res.json())[0])
      );
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card
        size="small"
        title="Průměrný nájezd kontrolovaných OA podle kraje"
        extra={
          linkToDetails && (
            <a href="/vehicles/average-mileage-by-region">Více</a>
          )
        }
      >
        <div className="h-64 md:h-96">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const options = {
    barPercentage: 1.15,
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
                item.parsed.x
              )
            );
          },
        },
      },
    },
    indexAxis: "y" as const,
    scales: {
      x: {
        title: {
          display: true,
          text: "Průměrný nájezd [km]",
        },
        beginAtZero: true,
      },
    },
  };

  const year = rawData.get("year");
  const rawCountData = new Map(rawData);
  rawCountData.delete("year");
  const sortedData = Array.from(rawCountData.entries()).sort(
    (a, b) => a[1] - b[1]
  );

  const data = {
    labels: sortedData.map((item) => item[0]),
    datasets: [
      {
        label: `${year}`,
        data: sortedData.map((item) => item[1]),
        axis: "y",
        backgroundColor: red[4],
      },
    ],
  };

  return (
    <Card
      size="small"
      title={`Průměrný nájezd kontrolovaných OA podle kraje (${year})`}
      extra={
        linkToDetails && <a href="/vehicles/average-mileage-by-region">Více</a>
      }
    >
      <div className="h-64 md:h-96">
        <Bar data={data} options={options}></Bar>
      </div>
    </Card>
  );
}
