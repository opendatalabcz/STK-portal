import Table from "antd/es/table";
import Tag from "antd/es/tag";
import { ColumnsType } from "antd/es/table";
import useSWR from "swr";

type MotorData = {
  make: string;
  model_primary: string;
  drive_type: string;
  min_motor_volume: number;
  max_motor_volume: number;
  min_motor_power: number;
  max_motor_power: number;
};

type CombinedMotorData = {
  drive_type: string;
  drive_types: string[];
  first_min_motor_volume?: number;
  first_max_motor_volume?: number;
  first_min_motor_power?: number;
  first_max_motor_power?: number;
  second_min_motor_volume?: number;
  second_max_motor_volume?: number;
  second_min_motor_power?: number;
  second_max_motor_power?: number;
};

export default function MotorsTable({
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
  const { data: firstData, isLoading: isFirstLoading } = useSWR(
    `/api/vehicles_motors_by_model?make=eq.${firstMake}&model_primary=eq.${firstModel}`,
    async (key) => {
      const res = await fetch(key);
      const data: MotorData[] = await res.json();
      return data;
    }
  );

  const { data: secondData, isLoading: isSecondLoading } = useSWR(
    `/api/vehicles_motors_by_model?make=eq.${secondMake}&model_primary=eq.${secondModel}`,
    async (key) => {
      const res = await fetch(key);
      const data: MotorData[] = await res.json();
      return data;
    }
  );

  // Combine data.
  const combinedDataMap: Map<string, CombinedMotorData> = new Map();
  if (firstData != undefined && secondData != undefined) {
    firstData.forEach((i) => {
      if (i.drive_type == null) return;

      combinedDataMap.set(i.drive_type, {
        drive_type: i.drive_type,
        drive_types: i.drive_type.startsWith("(")
          ? i.drive_type
              .substring(1, i.drive_type.length - 1)
              .split(",")
              .map((p) => {
                if (p.startsWith('"')) {
                  return p.substring(1, p.length - 1);
                } else {
                  return p;
                }
              })
          : [i.drive_type],
        first_max_motor_power: i.max_motor_power,
        first_max_motor_volume: i.max_motor_volume,
        first_min_motor_power: i.min_motor_power,
        first_min_motor_volume: i.min_motor_volume,
      });
    });

    secondData.forEach((i) => {
      if (i.drive_type == null) return;

      const record = combinedDataMap.get(i.drive_type);
      if (record != undefined) {
        combinedDataMap.set(i.drive_type, {
          ...record,
          second_max_motor_power: i.max_motor_power,
          second_max_motor_volume: i.max_motor_volume,
          second_min_motor_power: i.min_motor_power,
          second_min_motor_volume: i.min_motor_volume,
        });
      } else {
        combinedDataMap.set(i.drive_type, {
          drive_type: i.drive_type,
          drive_types: i.drive_type.startsWith("(")
            ? i.drive_type
                .substring(1, i.drive_type.length - 1)
                .split(",")
                .map((p) => {
                  if (p.startsWith('"')) {
                    return p.substring(1, p.length - 1);
                  } else {
                    return p;
                  }
                })
            : [i.drive_type],
          second_max_motor_power: i.max_motor_power,
          second_max_motor_volume: i.max_motor_volume,
          second_min_motor_power: i.min_motor_power,
          second_min_motor_volume: i.min_motor_volume,
        });
      }
    });
  }

  const combinedData = Array.from(combinedDataMap.values());

  const columns: ColumnsType<CombinedMotorData> = [
    {
      title: "Pohon",
      dataIndex: "drive_type",
      key: "drive_type",
      render: (_, { drive_type }) => {
        if (drive_type == null) {
          return <span className="text-gray-500">Neznámý</span>;
        }

        if (drive_type.startsWith("(")) {
          const parts = drive_type
            .substring(1, drive_type.length - 1)
            .split(",")
            .map((p) => {
              if (p.startsWith('"')) {
                return p.substring(1, p.length - 1);
              } else {
                return p;
              }
            });

          return parts.map((p) => (
            <Tag key={p} color="blue">
              {p}
            </Tag>
          ));
        } else {
          return <Tag color="blue">{drive_type}</Tag>;
        }
      },
      align: "center",
      filters: Array.from(
        new Set(combinedData.map((i) => i.drive_types).flat()).values()
      ).map((d) => {
        return { text: d, value: d };
      }),
      onFilter: (value, record) => record.drive_types.includes(value as string),
    },
    {
      title: firstMake + " " + firstModel,
      children: [
        {
          title: "Objem [l]",
          children: [
            {
              title: "min",
              key: "first_min_motor_volume",
              render: (_, { first_min_motor_volume }) =>
                first_min_motor_volume ?? (
                  <span className="text-gray-500">&mdash;</span>
                ),
              sorter: (a, b) =>
                (a.first_min_motor_volume ?? 0) -
                (b.first_min_motor_volume ?? 0),
            },
            {
              title: "max",
              key: "first_max_motor_volume",
              render: (_, { first_max_motor_volume }) =>
                first_max_motor_volume ?? (
                  <span className="text-gray-500">&mdash;</span>
                ),
              sorter: (a, b) =>
                (a.first_max_motor_volume ?? 0) -
                (b.first_max_motor_volume ?? 0),
            },
          ],
        },
        {
          title: "Výkon [kW]",
          children: [
            {
              title: "min",
              key: "first_min_motor_power",
              render: (_, { first_min_motor_power }) =>
                first_min_motor_power ?? (
                  <span className="text-gray-500">&mdash;</span>
                ),
              sorter: (a, b) =>
                (a.first_min_motor_power ?? 0) - (b.first_min_motor_power ?? 0),
            },
            {
              title: "max",
              key: "first_max_motor_power",
              render: (_, { first_max_motor_power }) =>
                first_max_motor_power ?? (
                  <span className="text-gray-500">&mdash;</span>
                ),
              sorter: (a, b) =>
                (a.first_max_motor_power ?? 0) - (b.first_max_motor_power ?? 0),
            },
          ],
        },
      ],
    },
    {
      title: secondMake + " " + secondModel,
      children: [
        {
          title: "Objem [l]",
          children: [
            {
              title: "min",
              key: "second_min_motor_volume",
              render: (_, { second_min_motor_volume }) =>
                second_min_motor_volume ?? (
                  <span className="text-gray-500">&mdash;</span>
                ),
              sorter: (a, b) =>
                (a.second_min_motor_volume ?? 0) -
                (b.second_min_motor_volume ?? 0),
            },
            {
              title: "max",
              key: "second_max_motor_volume",
              render: (_, { second_max_motor_volume }) =>
                second_max_motor_volume ?? (
                  <span className="text-gray-500">&mdash;</span>
                ),
              sorter: (a, b) =>
                (a.second_max_motor_volume ?? 0) -
                (b.second_max_motor_volume ?? 0),
            },
          ],
        },
        {
          title: "Výkon [kW]",
          children: [
            {
              title: "min",
              key: "second_min_motor_power",
              render: (_, { second_min_motor_power }) =>
                second_min_motor_power ?? (
                  <span className="text-gray-500">&mdash;</span>
                ),
              sorter: (a, b) =>
                (a.second_min_motor_power ?? 0) -
                (b.second_min_motor_power ?? 0),
            },
            {
              title: "max",
              key: "second_max_motor_power",
              render: (_, { second_max_motor_power }) =>
                second_max_motor_power ?? (
                  <span className="text-gray-500">&mdash;</span>
                ),
              sorter: (a, b) =>
                (a.second_max_motor_power ?? 0) -
                (b.second_max_motor_power ?? 0),
            },
          ],
        },
      ],
    },
  ];

  return (
    <Table
      className="max-w-[calc(100vw-3rem)] md:max-w-max"
      loading={isFirstLoading || isSecondLoading}
      dataSource={combinedData}
      columns={columns}
      pagination={{ hideOnSinglePage: true }}
      scroll={{
        x: true,
      }}
      locale={{
        emptyText: "Žádné motorizace nebyly nalezeny",
      }}
    ></Table>
  );
}
