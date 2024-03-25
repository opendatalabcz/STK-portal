import useSWR from "swr";
import DefectSpan from "./DefectTag";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import StationTag from "./StationTag";

type InspectionOnFrequentDayData = {
  id: bigint;
  station_id: string;
  date: string;
  vin: string;
};

export default function InspectionsOnFrequentDaysTable({
  vin,
}: {
  vin: string;
}) {
  const { data: inspectionData, isLoading: isInspectionsLoading } = useSWR(
    `/api/stations_repeated_inspections_on_different_station_list?vin=eq.${vin}&order=date.asc`,
    async (key) => {
      const res = await fetch(key);
      const data: InspectionOnFrequentDayData[] = await res.json();
      return data;
    }
  );

  const columns: ColumnsType<InspectionOnFrequentDayData> = [
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
  ];

  return (
    <Table
      className="max-w-[calc(100vw-3rem)] md:max-w-none"
      loading={isInspectionsLoading}
      dataSource={inspectionData}
      columns={columns}
      pagination={{ hideOnSinglePage: true }}
      scroll={{
        x: true,
      }}
      locale={{
        emptyText: "Žádné anomální prohlídky",
      }}
    ></Table>
  );
}
