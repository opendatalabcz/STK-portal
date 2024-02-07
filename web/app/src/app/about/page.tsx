import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import { Breadcrumb, Divider, Tag } from "antd";
import Link from "next/link";

export default async function AboutPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: "O projektu" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <h1 className="pb-4 text-3xl">O projektu</h1>

        <p>Zde budou informace o portálu.</p>
      </Container>
    </>
  );
}
