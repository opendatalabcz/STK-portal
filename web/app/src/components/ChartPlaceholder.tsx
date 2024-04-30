import Spin from "antd/es/spin";

export default function ChartPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full grow">
      <Spin></Spin>
    </div>
  );
}
