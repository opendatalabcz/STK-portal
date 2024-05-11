import { cyan, red } from "@ant-design/colors";
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
import ChartPlaceholder from "@/components/ChartPlaceholder";
import { Line } from "react-chartjs-2";
import Card from "antd/es/card";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type MileagePredictionData = {
  vin: string;
  future_mileage: number;
};

export default function MileageChart({ vehicle }: { vehicle: string }) {
  return (
    <Card size="small">
      <div className="h-48 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: inspectionData, isLoading: isInspectionsLoading } = useSWR(
      `/api/inspections?vin=eq.${vehicle}&order=date.asc`,
      async (key) => {
        const res = await fetch(key);
        const data: Inspection[] = await res.json();
        console.log(data);
        return data;
      }
    );

    const {
      data: mileagePredictionData,
      isLoading: isMileagePredictionLoading,
    } = useSWR(
      `/api/vehicles_mileage_prediction?vin=eq.${vehicle}`,
      async (key) => {
        const res = await fetch(key);
        const data: MileagePredictionData[] = await res.json();
        return data[0];
      }
    );

    if (isInspectionsLoading == true || isMileagePredictionLoading == true) {
      return <ChartPlaceholder></ChartPlaceholder>;
    }

    if (inspectionData == undefined || mileagePredictionData == undefined) {
      return <p>Predikce není k dispozici kvůli nedostatku dat.</p>;
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
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
            text: "Rok",
          },
        },
        y: {
          title: {
            display: true,
            text: "Nájezd na kontrole",
          },
          beginAtZero: true,
        },
      },
    };

    const regularInspections = inspectionData.filter(
      (e) => e.inspection_type == "regular"
    );

    if (regularInspections.length == 0) {
      return <p>Predikce není k dispozici kvůli nedostatku dat.</p>;
    }

    const data = {
      labels: [
        ...regularInspections.map((e) => e.date.split("-")[0]),
        // @ts-ignore
        regularInspections[regularInspections.length - 1].date.split("-")[0] *
          1.0 +
          2,
      ],
      datasets: [
        {
          label: "Nájezd",
          data: [
            ...regularInspections.map((e) => e.mileage),
            mileagePredictionData.future_mileage,
          ],
          borderColor: [...regularInspections.map((_) => red[4]), cyan[5]],
          backgroundColor: [...regularInspections.map((_) => red[4]), cyan[5]],
        },
        {
          label: "Predikovaný nájezd",
          data: [
            ...regularInspections.map((e) => null),
            mileagePredictionData.future_mileage,
          ],
          borderColor: cyan[5],
          backgroundColor: cyan[5],
        },
      ],
    };

    return <Line data={data} options={options}></Line>;
  }
}
