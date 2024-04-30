import useSWR from "swr";
import DefectSpan from "./DefectTag";
import Table, { ColumnsType } from "antd/es/table";
import StationTag from "./StationTag";
import Tag from "antd/es/tag";

export default function InspectionsTable({ vin }: { vin: string }) {
  const { data: inspectionData, isLoading: isInspectionsLoading } = useSWR(
    `/api/inspections?vin=eq.${vin}&order=date.asc`,
    async (key) => {
      const res = await fetch(key);
      const data: Inspection[] = await res.json();
      return data;
    }
  );

  interface IStringMap {
    [index: string]: string;
  }

  const inspectionTypeMap = {
    before_acceptance_repeated: "Před schvál. tech. způsobilosti - opakovaná",
    adr_repeated: "ADR - opakovaná",
    adr: "ADR",
    repeated: "Opakovaná",
    evidence: "Evidenční",
    road_repeated: "Silniční - opakovaná",
    before_registration: "Před registrací",
    on_demand: "Na žádost zákazníka",
    regular: "Pravidelná",
    before_registration_repeated: "Před registrací - opakovaná",
    ordered: "Nařízená",
    road_repeated_after_dn: "Silniční - opakovaná po DN",
    before_acceptance: "Před schvál. tech. způsobilosti",
  } as IStringMap;

  const columns: ColumnsType<Inspection> = [
    {
      title: "Datum",
      dataIndex: "date",
      key: "date",
      render: (value) => new Date(value).toLocaleDateString("cs-CZ"),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: "ascend",
    },
    {
      title: "Stanice",
      dataIndex: "station_id",
      key: "station_id",
      render: (_, { station_id }) => (
        <StationTag station={station_id}></StationTag>
      ),
      align: "center",
    },
    {
      title: "Typ",
      dataIndex: "type",
      key: "type",
      render: (_, { inspection_type }) =>
        inspection_type != null ? inspectionTypeMap[inspection_type] : "—",
    },
    {
      title: "Nájezd [km]",
      dataIndex: "mileage",
      key: "mileage",
      render: (value) => value.toLocaleString("cs-CZ"),
    },
    {
      title: "Výsledek",
      dataIndex: "mileage",
      key: "mileage",
      render: (_, { result }) => {
        if (result == 0) return <Tag color="green">Způsobilé</Tag>;
        if (result == 1) return <Tag color="orange">Částečně způsobilé</Tag>;
        return <Tag color="red">Nezpůsobilé</Tag>;
      },
    },
    {
      title: "Počet závad",
      dataIndex: "defects",
      key: "defectCount",
      render: (_, { defects, date }) => {
        if (date.startsWith("2018"))
          return <span className="text-gray-400">&mdash;</span>;

        if (defects == null || defects.length == 0) {
          return "0";
        } else {
          return defects.split(",").length.toString();
        }
      },
      sorter: (a, b) =>
        (a.defects == null ? 0 : a.defects.split(",").length) -
        (b.defects == null ? 0 : b.defects.split(",").length),
    },
    {
      title: "Závady",
      dataIndex: "defects",
      key: "defects",
      render: (_, { defects, date }) => {
        if (date.startsWith("2018"))
          return <span className="text-gray-400">Závady nejsou dostupné</span>;

        if (defects == null || defects.length == 0)
          return <Tag color="blue">Bez závad</Tag>;

        const parts = defects.split(",");
        return parts.map((d, index) => (
          <span key={index}>
            <DefectSpan defect={d}></DefectSpan>
          </span>
        ));
      },
    },
  ];

  return (
    <Table
      className="max-w-[calc(100vw-3rem)] md:max-w-max"
      loading={isInspectionsLoading}
      dataSource={inspectionData}
      columns={columns}
      pagination={{ hideOnSinglePage: true }}
      scroll={{
        x: true,
      }}
      locale={{
        emptyText: "Žádné prohlídky nebyly nalezeny",
      }}
    ></Table>
  );
}
