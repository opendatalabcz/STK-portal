import {
  CarOutlined,
  NumberOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

export default function VehicleGeneralCard({
  vehicleData,
}: {
  vehicleData: Vehicle;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <NumberOutlined className="mt-1" title="VIN" />
          <div>
            <p>
              {/* <span className="font-bold">VIN:&nbsp;</span> */}
              <span className="font-mono">{vehicleData.vin}</span>
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <CarOutlined className="mt-1" title="Kategorie vozidla" />
          <div>
            <p>
              {<span className="font-bold">{vehicleData.category}</span> ?? (
                <span className="font-bold text-gray-500">Chybí kategorie</span>
              )}
              {vehicleData.primary_type && <span>&nbsp;&ndash;&nbsp;</span>}
              {vehicleData.primary_type}
              {vehicleData.primary_type && vehicleData.secondary_type && ", "}
              {vehicleData.secondary_type}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <CalendarOutlined className="mt-1" />
          <table className="table-auto">
            <tbody>
              <tr>
                <td className="pr-2 font-bold">První registrace</td>
                <td className="px-2">
                  {vehicleData.first_registration != null ? (
                    new Date(vehicleData.first_registration).toLocaleDateString(
                      "cs-CZ"
                    )
                  ) : (
                    <span className="text-gray-500">&mdash;</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="pr-2 font-bold">První registrace v ČR</td>
                <td className="px-2">
                  {vehicleData.first_registration_cz != null ? (
                    new Date(
                      vehicleData.first_registration_cz
                    ).toLocaleDateString("cs-CZ")
                  ) : (
                    <span className="text-gray-500">&mdash;</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="pr-2 font-bold">Rok výroby</td>
                <td className="px-2">
                  {vehicleData.manufacture_year ?? (
                    <span className="text-gray-500">&mdash;</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
