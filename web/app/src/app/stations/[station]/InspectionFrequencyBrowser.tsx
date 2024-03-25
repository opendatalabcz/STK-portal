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
import { Button, Card } from "antd";
import { cyan } from "@ant-design/colors";
import useSWR from "swr";
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { useState } from "react";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type InspectionFrequencyData = {
  week: number;
  day: number;
  avg_inspection_count: number;
};

export default function InspectionFrequencyBrowser({
  station,
}: {
  station: string;
}) {
  // @ts-ignore
  Date.prototype.iso8601Week = function () {
    // Create a copy of the current date, we don't want to mutate the original
    const date = new Date(this.getTime());

    // Find Thursday of this week starting on Monday
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const thursday = date.getTime();

    // Find January 1st
    date.setMonth(0); // January
    date.setDate(1); // 1st
    const jan1st = date.getTime();

    // Round the amount of days to compensate for daylight saving time
    const days = Math.round((thursday - jan1st) / 86400000); // 1 day = 86400000 ms
    return Math.floor(days / 7) + 1;
  };
  // @ts-ignore
  let weekNumber = new Date().iso8601Week();
  if (new Date().getDay() == 6 || new Date().getDay() == 0) {
    weekNumber += 1;
  }

  const [selectedWeek, setSelectedWeek] = useState(weekNumber);

  const { data: rawData } = useSWR(
    `/api/stations_average_inspection_frequency?station_id=eq.${station}&week=eq.${selectedWeek}`,
    async (key) => {
      const res = await fetch(key);
      const data: InspectionFrequencyData[] = await res.json();
      return data;
    }
  );

  return (
    <Card
      size="small"
      // title="Typ pohonu nově registrovaných vozidel"
      title={`Týden ${selectedWeek}`}
      extra={
        <div className="space-x-4">
          <Button
            shape="circle"
            icon={<CaretLeftOutlined />}
            disabled={selectedWeek == 0}
            onClick={() => {
              if (selectedWeek > 0) {
                setSelectedWeek(selectedWeek - 1);
              }
            }}
          />
          {/* <span>{selectedWeek}</span> */}
          <Button
            shape="circle"
            icon={<CaretRightOutlined />}
            disabled={selectedWeek == 53}
            onClick={() => {
              if (selectedWeek < 53) {
                setSelectedWeek(selectedWeek + 1);
              }
            }}
          />
        </div>
      }
    >
      <div className="h-64">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
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
          // stacked: true,
          // title: {
          //   display: true,
          //   text: "Den",
          // },
        },
        y: {
          // stacked: true,
          title: {
            display: true,
            text: "Počet prohlídek",
          },
          beginAtZero: true,
        },
      },
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
                Intl.NumberFormat("cs-CZ", {
                  maximumFractionDigits: 2,
                }).format(item.parsed.y)
              );
            },
          },
        },
      },
    };

    const data = {
      labels: ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
      datasets: [
        {
          label: "Průměrný počet prohlídek",
          data: rawData.map((e, i) => e.avg_inspection_count),
          // @ts-ignore
          backgroundColor: (ctx) => {
            let dow = new Date().getDay();
            if (dow == 0) {
              dow = 7;
            }

            if (weekNumber == selectedWeek && dow == ctx.parsed.x + 1) {
              return cyan[7];
            } else {
              return cyan[5];
            }
          },
        },
      ],
    };

    return <Bar data={data} options={options}></Bar>;
  }
}
