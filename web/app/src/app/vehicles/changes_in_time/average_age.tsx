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
  ScriptableScaleContext,
} from "chart.js";
import { Line } from "react-chartjs-2";

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

export default function AverageAgeChart() {
  const { data: rawData } = useSWR(
    "/api/vehicles_changes_in_time_average_age",
    async (key) => {
      const res = await fetch(key);
      const data: AverageAgeData = await res.json();
      return data;
    }
  );

  if (rawData != undefined) {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          // position: 'top' as const,
          display: false,
        },
      },
      scales: {
        y: {
          grid: {
            color: function (context: ScriptableScaleContext) {
              if (Number.isInteger(context.tick.value as number)) {
                return "rgb(0,0,0)";
              } else {
                return "rgb(200,200,200)";
              }
            },
          },
        },
      },
    };

    const data = {
      labels: rawData.map((e) => e.year),
      datasets: [
        {
          label: "Průměrný věk",
          data: rawData.map((e) => e.mean),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    return (
      <div className="h-48 pt-2 md:h-64">
        <Line data={data} datasetIdKey="average_age" options={options}></Line>
      </div>
    );
  } else {
    return <div>Načítání...</div>;
  }
}
