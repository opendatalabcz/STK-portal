import { cyan, red } from "@ant-design/colors";
import Card from "antd/es/card";
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
import { min, max, range } from "lodash";
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
      spanGaps: true,
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

    const minAge = Math.min(
      // @ts-ignore
      min(firstRegularInspections.map((x) => x.date.split("-")[0] * 1.0)) ?? 0,
      // @ts-ignore
      min(secondRegularInspections.map((x) => x.date.split("-")[0] * 1.0)) ?? 0
    );
    // @ts-ignore
    const firstMaxAge =
      // @ts-ignore
      max(firstRegularInspections.map((x) => x.date.split("-")[0] * 1.0)) ?? 0;
    const secondMaxAge =
      // @ts-ignore
      max(secondRegularInspections.map((x) => x.date.split("-")[0] * 1.0)) ?? 0;
    const maxAge = Math.max(firstMaxAge, secondMaxAge);
    const years = range(minAge - 1, maxAge + 4, 1);
    const firstMileages: (number | null)[] = [];
    const secondMileages: (number | null)[] = [];
    years.forEach((y) => {
      const firstPoint = firstRegularInspections.find(
        // @ts-ignore
        (x) => x.date.split("-")[0] * 1.0 == y
      );
      const secondPoint = secondRegularInspections.find(
        // @ts-ignore
        (x) => x.date.split("-")[0] * 1.0 == y
      );

      if (firstPoint != null) {
        firstMileages.push(firstPoint.mileage);
      } else {
        if (y == firstMaxAge + 2) {
          firstMileages.push(firstMileagePredictionData.future_mileage);
        } else {
          firstMileages.push(null);
        }
      }

      if (secondPoint != null) {
        secondMileages.push(secondPoint.mileage);
      } else {
        if (y == secondMaxAge + 2) {
          secondMileages.push(secondMileagePredictionData.future_mileage);
        } else {
          secondMileages.push(null);
        }
      }
    });

    const data = {
      labels: years,
      datasets: [
        {
          label: `Nájezd ${firstVehicleName}`,
          data: firstMileages,
          borderColor: [
            ...range(minAge - 1, firstMaxAge + 1).map((_) => cyan[5]),
            ...range(firstMaxAge + 2, maxAge + 4).map((_) => cyan[7]),
          ],
          backgroundColor: [
            ...range(minAge - 1, firstMaxAge + 1).map((_) => cyan[5]),
            ...range(firstMaxAge + 2, maxAge + 4).map((_) => cyan[7]),
          ],
        },
        {
          label: `Nájezd ${secondVehicleName}`,
          data: secondMileages,
          borderColor: [
            ...range(minAge - 1, secondMaxAge + 1).map((_) => red[4]),
            ...range(secondMaxAge + 2, maxAge + 4).map((_) => red[7]),
          ],
          backgroundColor: [
            ...range(minAge - 1, secondMaxAge + 1).map((_) => red[4]),
            ...range(secondMaxAge + 2, maxAge + 4).map((_) => red[7]),
          ],
        },
      ],
    };

    return <Line data={data} options={options}></Line>;
  }
}
