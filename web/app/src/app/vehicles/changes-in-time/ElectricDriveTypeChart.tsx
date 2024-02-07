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
  elektropohon: number;
  nafta_hybrid: number;
  benzin_hybrid: number;
};

export default function ElectricDriveTypeChart({
  linkToDetails = false,
}: {
  linkToDetails?: boolean;
}) {
  const { data: rawData } = useSWR(
    "/api/vehicles_changes_in_time_electric_drive_type?year=gte.2010",
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
        label: "Elektropohon",
        data: rawData.map((e, i) => e.elektropohon),
        backgroundColor: geekblue[5],
      },
      {
        label: "Benzin hybrid",
        data: rawData.map((e, i) => e.benzin_hybrid),
        backgroundColor: green[6],
      },
      {
        label: "Nafta hybrid",
        data: rawData.map((e, i) => e.nafta_hybrid),
        backgroundColor: red[4],
      },
    ],
  };

  return (
    <Card
      size="small"
      title="Elektrifikace nově registrovaných vozidel"
      extra={
        linkToDetails && (
          <a href="/vehicles/changes-in-time/electric-drive-type">Více</a>
        )
      }
    >
      <div className="h-48 md:h-96">
        <Bar data={data} datasetIdKey="colors" options={options}></Bar>
      </div>
    </Card>
  );
}
