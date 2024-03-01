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
import { firstVehiclesYear, latestYear } from "@/years";
import { ModelPopularityData } from "./TopModelsChart";

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

const skodaModels = [
  "ŠKODA CITIGO",
  "ŠKODA FABIA",
  "ŠKODA FABIA COMBI",
  "ŠKODA FAVORIT",
  "ŠKODA FELICIA",
  "ŠKODA FELICIA COMBI",
  "ŠKODA KAMIQ",
  "ŠKODA KAROQ",
  "ŠKODA KODIAQ",
  "ŠKODA OCTAVIA",
  "ŠKODA OCTAVIA COMBI",
  "ŠKODA RAPID",
  "ŠKODA ROOMSTER",
  "ŠKODA SCALA",
  "ŠKODA SUPERB",
  "ŠKODA YETI",
  "ŠKODA 135",
  "ŠKODA 136",
];

const vagModels = [
  "AUDI A3",
  "AUDI A4",
  "AUDI A6",
  // "SEAT ALHAMBRA",
  // "SEAT CORDOBA",
  "SEAT IBIZA",
  "SEAT LEON",
  // "SEAT TOLEDO",
  // "VW CRAFTER",
  "VW GOLF",
  // "VW MULTIVAN",
  "VW PASSAT",
  "VW POLO",
  "VW SHARAN",
  "VW TRANSPORTER",
  "VW TIGUAN",
  // "VW TOUAREG",
  "VW TOURAN",
];

const frenchModels = [
  "CITROËN 306",
  "CITROËN PICASSO",
  "CITROËN XSARA",
  "CITROËN C3",
  "PEUGEOT 106",
  "PEUGEOT 135",
  "PEUGEOT 307",
  "PEUGEOT 5008",
  "RENAULT TWINGO",
  "RENAULT LAGUNA",
  "RENAULT MASTER",
  "RENAULT MEGANE",
  "RENAULT CLIO",
];

const asianModels = [
  "HONDA CIVIC",
  "HYUNDAI ACCENT",
  "HYUNDAI i 30",
  "HYUNDAI IX 20",
  "HYUNDAI TUCSON",
  "KIA RIO",
  "KIA SORENTO",
  "KIA SPORTAGE",
  "TOYOTA AURIS",
  "TOYOTA AVENSIS",
  "TOYOTA COROLLA",
];

const otherModels = [
  "DACIA DUSTER",
  "FIAT PUNTO",
  "FIAT BRAVO",
  "FIAT DOBLÓ",
  "FORD CMAX",
  "FORD FIESTA",
  "FORD FOCUS",
  "FORD FUSION",
  "FORD GALAXY",
  "FORD MONDEO",
  "FORD SMAX",
  "FORD TRANSIT",
  "OPEL ASTRA",
  "OPEL CORSA",
  "OPEL VECTRA",
];

const datasets = ["Škoda", "Ostatní VAG", "Francouzské", "Asijské", "Ostatní"];

const datasetsByLabel = [
  skodaModels,
  vagModels,
  frenchModels,
  asianModels,
  otherModels,
];

const tabList = datasets.map((label, index) => {
  return {
    key: `${index}`,
    tab: label,
  };
});

export default function SelectedModelsPopularityBrowser() {
  const [selectedData, setSelectedData] = useState(0);
  const models = datasetsByLabel[selectedData].map((i) => `\"${i}\"`).join(",");

  const { data: rawData } = useSWR(
    `/api/vehicles_model_popularity?year=gte.${firstVehiclesYear}&year=lte.${latestYear}&model=in.(${models})&order=year.asc`,
    async (key) => {
      const res = await fetch(key);
      const data: ModelPopularityData[] = await res.json();
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

  // @ts-ignore
  const years = [...Array(latestYear - firstVehiclesYear + 1).keys()].map(
    (i) => i + firstVehiclesYear
  );

  const data = {
    labels: years,
    datasets: datasetsByLabel[selectedData].map((label) => {
      return {
        label: label,
        data: years.map((year) => {
          const point = rawData
            .filter((i) => i.year == year)
            .find((i) => i.model == label);
          if (point != undefined) return point.count;
          return null;
        }),
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
