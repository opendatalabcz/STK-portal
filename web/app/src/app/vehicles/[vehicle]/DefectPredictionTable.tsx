import { green, orange, red } from "@ant-design/colors";
import Progress, { ProgressProps } from "antd/es/progress";
import Table, { ColumnsType } from "antd/es/table";
import useSWR from "swr";

type DefectPredictionData = {
  vin: string;
  future_defect_prob_0: number;
  future_defect_prob_1: number;
  future_defect_prob_2: number;
  future_defect_prob_3: number;
  future_defect_prob_4: number;
  future_defect_prob_5: number;
  future_defect_prob_6: number;
};

export default function DefectPredictionTable({
  vehicle,
}: {
  vehicle: string;
}) {
  const { data: defectPredictionData, isLoading: isDefectPredictionLoading } =
    useSWR(`/api/vehicles_defect_prediction?vin=eq.${vehicle}`, async (key) => {
      const res = await fetch(key);
      const data: DefectPredictionData[] = await res.json();
      return data[0];
    });

  const table =
    defectPredictionData != undefined
      ? [
          {
            category: "0. Identifikace vozidla",
            probability: defectPredictionData.future_defect_prob_0,
          },
          {
            category: "1. Brzdové zařízení",
            probability: defectPredictionData.future_defect_prob_1,
          },
          {
            category: "2. Řízení",
            probability: defectPredictionData.future_defect_prob_2,
          },
          {
            category: "3. Výhledy",
            probability: defectPredictionData.future_defect_prob_3,
          },
          {
            category: "4. Světlomety, elektrické zařízení apod.",
            probability: defectPredictionData.future_defect_prob_4,
          },
          {
            category: "5. Nápravy, kola, pneumatiky a zavěšení",
            probability: defectPredictionData.future_defect_prob_5,
          },
          {
            category: "6. Podvozek a části připevněné k podvozku",
            probability: defectPredictionData.future_defect_prob_6,
          },
        ]
      : undefined;

  const columns: ColumnsType<{ category: string; probability: number }> = [
    {
      title: "Kategorie závady",
      dataIndex: "category",
      key: "category",
      render: (value) => value,
    },
    {
      title: "Pravděpodobnost",
      dataIndex: "probability",
      key: "probability",
      sorter: (a, b) => b.probability - a.probability,
      render: (value) => {
        const color: ProgressProps["strokeColor"] =
          value < 0.25
            ? green[4]
            : value < 0.5
            ? orange[4]
            : value < 0.75
            ? red[4]
            : red[7];

        return (
          <div className="flex flex-row">
            <Progress
              percent={value * 100}
              size={[200, 16]}
              showInfo={false}
              strokeColor={color}
            ></Progress>
            {Intl.NumberFormat("cs-CZ", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(value * 100)}
            &nbsp;%
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className="max-w-[calc(100vw-3rem)] md:max-w-max"
      loading={isDefectPredictionLoading}
      dataSource={table}
      columns={columns}
      pagination={{ hideOnSinglePage: true }}
      scroll={{
        x: true,
      }}
      locale={{
        emptyText:
          "Predikci nelze zobrazit. Mohou chybět data o prohlídkách, jiné potřebné informace o vozidle, nebo je vozidlo příliš raritní pro predikci.",
      }}
    ></Table>
  );
}
