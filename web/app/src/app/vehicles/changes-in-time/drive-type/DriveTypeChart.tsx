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
import { Card, Spin } from "antd";
import { geekblue, gold, green, red } from "@ant-design/colors";
import useSWR from "swr";
import { usePathname } from "next/navigation";

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

export default function DriveTypeChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    "/api/vehicles_changes_in_time_drive_type?year=gte.1990",
    async (key) => {
      const res = await fetch(key);
      const data: DriveTypeData[] = await res.json();
      console.log(data);
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <div className="flex items-center justify-center grow">
        <Spin></Spin>
      </div>
    );
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
          text: "Počet registrovaných vozidel",
        },
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: rawData.map((e) => e.year),
    datasets: [
      {
        label: "Benzin",
        data: rawData.map((e, i) => e.benzin),
        backgroundColor: green[6],
      },
      {
        label: "Nafta",
        data: rawData.map((e, i) => e.nafta),
        backgroundColor: red[4],
      },
      {
        label: "Elektrifikované",
        data: rawData.map((e, i) => e.elektrifikovane),
        backgroundColor: geekblue[5],
      },

      {
        label: "Plyn (i v kombinaci)",
        data: rawData.map((e, i) => e.plyn),
        backgroundColor: gold[7],
      },
      {
        label: "Ostatní",
        data: rawData.map((e, i) => e.ostatni),
        backgroundColor: "grey",
      },
    ],
  };

  return (
    <Card
      size="small"
      title="Typ pohonu nově registrovaných vozidel"
      extra={
        linkToDetails && <a href="/vehicles/changes-in-time/drive-type">Více</a>
      }
    >
      <div className="h-48 md:h-96">
        <Bar
          className=""
          data={data}
          datasetIdKey="colors"
          options={options}
        ></Bar>
      </div>
    </Card>
  );
}
