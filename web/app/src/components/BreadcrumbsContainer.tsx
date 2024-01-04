import Breadcrumb from "antd/es/breadcrumb/Breadcrumb";

export default function BreadcrumbsContainer({
  children,
}: {
  children: React.ReactNode | undefined;
}) {
  return (
    <div className="px-4 pt-3 text-sm sm:pt-4 sm:text-base">{children}</div>
  );
}
