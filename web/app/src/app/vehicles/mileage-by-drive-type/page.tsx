import { Breadcrumb } from "antd";
import Link from "next/link";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import MileageByDriveTypeChart from "./MileageByDriveTypeChart";

export default function EcologyPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: <Link href="/vehicles">Vozidla</Link> },
            { title: "Poměrný nájezd podle typu pohonu" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <div className="space-y-4">
          <MileageByDriveTypeChart></MileageByDriveTypeChart>

          <p>
            Statistika ukazuje podíl, jakým vozidla, která byla v daném roce na
            technické kontrole, přispívají k celkovému součtu zjištěných
            nájezdů. Vidíme tedy odhad toho, v jakém poměru jsou využívána
            jednotlivá paliva.
          </p>

          <p>
            Jelikož je součet nájezdů získáván z vozidel, která byla daný rok na
            kontrole, budeme pozorovat zvyšování podílu elektrifikovaného
            nájezdu vůči podílu nově registrovaných elektrifikovaných vozidel
            zhruba se čtyřletým zpožděním, protože nová vozidla s významnějším
            nájezdem teprve po čtyřech letech pojedou na pravidelnou technickou
            kontrolu.
          </p>

          <p>
            Poměrný nájezd nafty může být také zvyšován jejím uplatněním u
            nákladních vozidel a dodávek, které mají zpravidla vyšší nájezd.
          </p>

          <p>
            Skutečný údaj o typu pohonu v technickém průkazu může být
            složitější, pohony jsou proto seskupeny do jednodušších kategorií,
            které jsou popsány <a href="/vehicles/drive-type">zde</a>.
          </p>
        </div>
      </Container>
    </>
  );
}
