"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  Colors,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card } from "antd";
import useSWR from "swr";
import { useState } from "react";
import ChartPlaceholder from "@/components/ChartPlaceholder";

ChartJS.register(
  CategoryScale,
  Colors,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: "Rok",
      },
    },
    y: {
      title: {
        display: true,
        text: "Počet nově registrovaných vozidel",
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
            )
          );
        },
      },
    },
  },
};

const basicMakes = [
  "AUDI",
  "BMW",
  "CITROËN",
  "DACIA",
  "FIAT",
  "FORD",
  "HYUNDAI",
  "KIA",
  "MERCEDES-BENZ",
  "OPEL",
  "PEUGEOT",
  "RENAULT",
  "SEAT",
  "ŠKODA",
  "TOYOTA",
  "VW",
];

const uncommonMakes = [
  "ALFA ROMEO",
  "CHEVROLET",
  "DAEWOO",
  "DAIHATSU",
  "HONDA",
  "KNAUS",
  "MAZDA",
  "MITSUBISHI",
  "NISSAN",
  "ROVER",
  "SAAB",
  "SSANGYONG",
  "SUBARU",
  "SUZUKI",
  "VOLVO",
];

const rareMakes = [
  "CHRYSLER",
  "DODGE",
  "JAGUAR",
  "JEEP",
  "LANCIA",
  "LAND ROVER",
  "LEXUS",
  "MINI",
  "PORSCHE",
  "SMART",
];

const motorcycleMakes = [
  "PRAGA",
  "YAMAHA",
  "JAWA",
  "SIMSON",
  "HUSQVARNA",
  "KTM",
  "HARLEY-DAVIDSON",
  "BABETTA",
  "APRILIA",
  "DUCATI",
  "TRIUMPH",
  "KAWASAKI",
  "ČZ",
  "KYMCO",
  "JONWAY",
  "SYM",
  "BAOTIAN",
  "KENTOYA",
  "LONGJIA",
  "ZNEN",
];

const otherMakes = [
  "AVIA",
  "VAZ",
  "TATRA",
  "TRABANT",
  "WARTBURG",
  "LIAZ",
  "VLASTNÍ VÝROBA",
];

const datasets = ["Běžné", "Méně časté", "Vzácné", "Jednostopé", "Ostatní"];

const datasetLabels = [
  basicMakes,
  uncommonMakes,
  rareMakes,
  motorcycleMakes,
  otherMakes,
];

const tabList = datasets.map((label, index) => {
  return {
    key: `${index}`,
    tab: label,
  };
});

export default function SelectedMakesPopularityBrowser() {
  const [selectedData, setSelectedData] = useState(0);

  const { data: rawData } = useSWR(
    "/api/vehicles_make_popularity?order=year.asc",
    async (key) => {
      const res = await fetch(key);
      const data = Array.from(await res.json());
      console.log(data);
      return data;
    }
  );

  if (rawData == undefined) {
    return (
      <Card title="Vývoj počtu nových registrací">
        <div className="h-[30rem]">
          <ChartPlaceholder></ChartPlaceholder>
        </div>
      </Card>
    );
  }

  const data = {
    // @ts-ignore
    labels: rawData.map((item) => item["year"]),
    datasets: datasetLabels[selectedData].map((label) => {
      return {
        label: label,
        // @ts-ignore
        data: rawData.map((year) => year[label]),
      };
    }),
  };

  return (
    <Card
      title="Vývoj počtu nových registrací"
      tabList={tabList}
      activeTabKey={`${selectedData}`}
      onTabChange={(key) => {
        setSelectedData(Number.parseInt(key));
      }}
    >
      <div className="h-[30rem]">
        <Line data={data} options={options}></Line>
      </div>
    </Card>
  );
}