import { cyan, green, orange, red } from "@ant-design/colors";
import { Card, Progress, ProgressProps, Table } from "antd";
import { ColumnsType } from "antd/es/table";
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

export default function DoubleMileageChart({
  firstVin,
  secondVin,
  firstVehicleName,
  secondVehicleName,
}: {
  firstVin: string;
  secondVin: string;
  firstVehicleName: string;
  secondVehicleName: string;
}) {
  return (
    <Card size="small">
      <div className="h-48 md:h-96">{_buildChart()}</div>
    </Card>
  );

  function _buildChart() {
    const { data: firstInspectionData, isLoading: isFirstInspectionsLoading } =
      useSWR(
        `/api/inspections?vin=eq.${firstVin}&order=date.asc`,
        async (key) => {
          const res = await fetch(key);
          const data: Inspection[] = await res.json();
          return data;
        }
      );

    const {
      data: secondInspectionData,
      isLoading: isSecondInspectionsLoading,
    } = useSWR(
      `/api/inspections?vin=eq.${secondVin}&order=date.asc`,
      async (key) => {
        const res = await fetch(key);
        const data: Inspection[] = await res.json();
        return data;
      }
    );

    const {
      data: firstMileagePredictionData,
      isLoading: isFirstMileagePredictionLoading,
    } = useSWR(
      `/api/vehicles_mileage_prediction?vin=eq.${firstVin}`,
      async (key) => {
        const res = await fetch(key);
        const data: MileagePredictionData[] = await res.json();
        return data[0];
      }
    );

    const {
      data: secondMileagePredictionData,
      isLoading: isSecondMileagePredictionLoading,
    } = useSWR(
      `/api/vehicles_mileage_prediction?vin=eq.${secondVin}`,
      async (key) => {
        const res = await fetch(key);
        const data: MileagePredictionData[] = await res.json();
        return data[0];
      }
    );

    if (
      isFirstInspectionsLoading ||
      isSecondInspectionsLoading ||
      isFirstMileagePredictionLoading ||
      isSecondMileagePredictionLoading
    ) {
      return <ChartPlaceholder></ChartPlaceholder>;
    }

    if (
      firstInspectionData == undefined ||
      firstMileagePredictionData == undefined ||
      secondInspectionData == undefined ||
      secondMileagePredictionData == undefined
    ) {
      return (
        <p>Predikce není k dispozici kvůli chybějícím datům o prohlídkách.</p>
      );
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

    const firstRegularInspections = firstInspectionData.filter(
      (e) => e.inspection_type == "regular"
    );
    const secondRegularInspections = secondInspectionData.filter(
      (e) => e.inspection_type == "regular"
    );

    const data = {
      labels: [
        ...firstRegularInspections.map((e) => e.date.split("-")[0]),
        // @ts-ignore
        firstRegularInspections[firstRegularInspections.length - 1].date.split(
          "-"
        )[0] *
          1.0 +
          2,
      ],
      datasets: [
        {
          label: `Nájezd ${firstVehicleName}`,
          data: [
            ...firstRegularInspections.map((e) => e.mileage),
            firstMileagePredictionData.future_mileage,
          ],
          borderColor: [
            ...firstRegularInspections.map((_) => cyan[5]),
            cyan[7],
          ],
          backgroundColor: [
            ...firstRegularInspections.map((_) => cyan[5]),
            cyan[7],
          ],
        },
        {
          label: `Predikovaný nájezd ${firstVehicleName}`,
          data: [
            ...firstRegularInspections.map((e) => null),
            firstMileagePredictionData.future_mileage,
          ],
          borderColor: cyan[7],
          backgroundColor: cyan[7],
        },

        {
          label: `Nájezd ${secondVehicleName}`,
          data: [
            ...secondRegularInspections.map((e) => e.mileage),
            secondMileagePredictionData.future_mileage,
          ],
          borderColor: [...secondRegularInspections.map((_) => red[4]), red[4]],
          backgroundColor: [
            ...secondRegularInspections.map((_) => red[4]),
            red[4],
          ],
        },
        {
          label: `Predikovaný nájezd ${secondVehicleName}`,
          data: [
            ...secondRegularInspections.map((e) => null),
            secondMileagePredictionData.future_mileage,
          ],
          borderColor: red[7],
          backgroundColor: red[7],
        },
      ],
    };

    return <Line data={data} options={options}></Line>;
  }
}
