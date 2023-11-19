import Breadcrumb from "antd/es/breadcrumb/Breadcrumb";

export default function Breadcrumbs({
  children,
}: {
  children: React.ReactNode | undefined;
}) {
  return (
    <Breadcrumb className="px-4 pt-3 text-sm sm:pt-4 sm:text-base">
      {children}
    </Breadcrumb>
  );
}
