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
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { cyan, red } from "@ant-design/colors";
import { max, range } from "lodash";
import Card from "antd/es/card/Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type MileageByAgeData = {
  make: string;
  model_primary: string;
  age: number;
  avg_mileage: number;
};

export default function MileageByAgeChart({
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
      `/api/vehicles_average_mileage_by_age?make=eq.${firstMake}&model_primary=eq.${firstModel}`,
      async (key) => {
        const res = await fetch(key);
        const data: MileageByAgeData[] = await res.json();
        return data;
      }
    );

    const { data: secondData } = useSWR(
      `/api/vehicles_average_mileage_by_age?make=eq.${secondMake}&model_primary=eq.${secondModel}`,
      async (key) => {
        const res = await fetch(key);
        const data: MileageByAgeData[] = await res.json();
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
                Intl.NumberFormat("cs-CZ", {
                  maximumFractionDigits: 0,
                }).format(item.parsed.y) + " km"
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
            text: "Průměrný nájezd [km]",
          },
          beginAtZero: true,
        },
      },
    };

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
        firstMileages.push(firstPoint.avg_mileage);
      } else {
        firstMileages.push(null);
      }

      if (secondPoint != null) {
        secondMileages.push(secondPoint.avg_mileage);
      } else {
        secondMileages.push(null);
      }
    });

    const data = {
      labels: years,
      datasets: [
        {
          label: `${firstMake} ${firstModel}`,
          data: firstMileages,
          borderColor: red[4],
          backgroundColor: red[4],
        },
        {
          label: `${secondMake} ${secondModel}`,
          data: secondMileages,
          borderColor: cyan[5],
          backgroundColor: cyan[5],
        },
      ],
    };

    return <Line data={data} options={options}></Line>;
  }
}
