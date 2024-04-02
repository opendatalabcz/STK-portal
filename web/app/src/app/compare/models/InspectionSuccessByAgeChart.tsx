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
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card } from "antd";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { cyan, red } from "@ant-design/colors";
import { first, max, range } from "lodash";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type SuccessByAgeData = {
  make: string;
  model_primary: string;
  age: number;
  avg_success: number;
};

export default function InspectionSuccessByAgeChart({
  firstMake,
  firstModel,
  secondMake,
  secondModel,
}: {
  firstMake: string;
  firstModel: string;
  secondMake: string;
  secondModel: string;
}) {
  return (
    <Card size="small">
      <div className="h-48 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: firstData } = useSWR(
      `/api/inspections_avg_success_by_model_age?make=eq.${firstMake}&model_primary=eq.${firstModel}`,
      async (key) => {
        const res = await fetch(key);
        const data: SuccessByAgeData[] = await res.json();
        return data;
      }
    );

    const { data: secondData } = useSWR(
      `/api/inspections_avg_success_by_model_age?make=eq.${secondMake}&model_primary=eq.${secondModel}`,
      async (key) => {
        const res = await fetch(key);
        const data: SuccessByAgeData[] = await res.json();
        return data;
      }
    );

    if (firstData == undefined || secondData == undefined) {
      return <ChartPlaceholder></ChartPlaceholder>;
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            // @ts-ignore
            title: (item) => {
              return `${item[0].label} ${
                item[0].label == 1
                  ? "rok"
                  : item[0].label > 1 && item[0].label < 5
                  ? "roky"
                  : "let"
              } (${item[0].dataset.label})`;
            },
            // @ts-ignore
            label: (item) => {
              return (
                item.dataset.label +
                ": " +
                Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 1 }).format(
                  item.parsed.y
                ) +
                " %"
              );
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Věk",
          },
        },
        y: {
          title: {
            display: true,
            text: "Úspěšnost na kontrolách [%]",
          },
          beginAtZero: false,
        },
      },
    };

    console.log(firstData);

    const maxAge = Math.max(
      max(firstData.map((x) => x.age)) ?? 0,
      max(secondData.map((x) => x.age)) ?? 0
    );
    const years = range(maxAge);
    const firstMileages: (number | null)[] = [];
    const secondMileages: (number | null)[] = [];
    years.forEach((y) => {
      const firstPoint = firstData.find((x) => x.age == y);
      const secondPoint = secondData.find((x) => x.age == y);

      if (firstPoint != null) {
        firstMileages.push(firstPoint.avg_success);
      } else {
        firstMileages.push(null);
      }

      if (secondPoint != null) {
        secondMileages.push(secondPoint.avg_success);
      } else {
        secondMileages.push(null);
      }
    });

    const data = {
      labels: years,
      datasets: [
        {
          label: `${firstMake} ${firstModel}`,
          data: firstMileages.map((e) => (e != null ? e * 100 : null)),
          borderColor: red[4],
          backgroundColor: red[4],
        },
        {
          label: `${secondMake} ${secondModel}`,
          data: secondMileages.map((e) => (e != null ? e * 100 : null)),
          borderColor: cyan[5],
          backgroundColor: cyan[5],
        },
      ],
    };

    return <Line data={data} options={options}></Line>;
  }
}
