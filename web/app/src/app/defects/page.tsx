"use client";

import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import Link from "next/link";
import Breadcrumb from "antd/es/breadcrumb";
import Tag from "antd/es/tag";
import Divider from "antd/es/divider";
import useSWR from "swr";
import Spin from "antd/es/spin";

export default function DefectsPage() {
  const { data, isLoading } = useSWR(`/api/defects`, async (key) => {
    const res = await fetch(key);
    const data: Defect[] = await res.json();
    return data;
  });

  interface IStringMap {
    [index: string]: string;
  }

  const defectTypeColorMap = {
    A: "green",
    B: "orange",
    C: "red",
  } as IStringMap;

  if (data) {
    return (
      <>
        <BreadcrumbsContainer>
          <Breadcrumb
            items={[
              { title: <Link href="/">STK portál</Link> },
              { title: "Číselník závad" },
            ]}
          ></Breadcrumb>
        </BreadcrumbsContainer>

        <Container>
          <h1 className="pb-4 text-3xl">Číselník závad</h1>

          <p>
            Podle{" "}
            <a href="https://www.zakonyprolidi.cz/cs/2018-211">
              Vyhlášky č. 211/2018 Sb.
            </a>{" "}
            se závady na vozidlech zjištěné při technické kontrole dělí podle
            závažnosti do tří kategorií:
          </p>

          <ul className="py-2 pl-6 list-disc">
            <li>
              <Tag color="green">A</Tag> lehká závada
            </li>
            <li>
              <Tag color="orange">B</Tag> vážná závada
            </li>
            <li>
              <Tag color="red">C</Tag> nebezpečná závada
            </li>
          </ul>

          <p>
            Na této stránce je k dispozici kompletní číselník závad podle
            původního znění této vyhlášky. Existují také novější verze, které
            číselník mírně upravují, ale pro účely analýzy dat dostupných na
            tomto webu mezi nimi není rozdíl. Může se pouze stát, že některá z
            novějších prohlídek dostupná v detailu vozidla obsahuje závadu,
            která v tomto číselníku není.
          </p>

          <h2 className="pt-4 text-2xl">Okruhy závad</h2>

          <ol className="pt-4 pl-6 list-decimal" start={0}>
            <li>
              <a href="#0.1.1">Identifikace vozidla</a>
            </li>
            <li>
              <a href="#1.1.1.1.1">Brzdové zařízení</a>
            </li>
            <li>
              <a href="#2.1.1.1.1">Řízení</a>
            </li>
            <li>
              <a href="#3.1.1.1">Výhledy</a>
            </li>
            <li>
              <a href="#4.1.1.1.1">
                Svítilny, světlomety, odrazky a elektrické zařízení
              </a>
            </li>
            <li>
              <a href="#5.1.1.1">Nápravy, kola, pneumatiky a zavěšení náprav</a>
            </li>
            <li>
              <a href="#6.1.1.1.1">Podvozek a části připevněné k podvozku</a>
            </li>
            <li>
              <a href="#7.1.1.1.1">Jiné vybavení</a>
            </li>
            <li>
              <a href="#8.1.1.1">Obtěžování okolí</a>
            </li>
            <li>
              <a href="#9.1.1.1">
                Další prohlídky vozidel k dopravě osob kategorie M2 a M3
              </a>
            </li>
          </ol>

          <h2 className="pt-4 text-2xl">Číselník</h2>

          <div className="h-4"></div>

          {data.map((defect) => (
            <div key={defect.code} id={defect.code}>
              <h2 className="text-xl">{defect.code}</h2>

              <div>
                <Tag color={defectTypeColorMap[defect.type]}>{defect.type}</Tag>
                <span>{defect.description}</span>
              </div>
              <Divider></Divider>
            </div>
          ))}
        </Container>
      </>
    );
  } else if (isLoading) {
    return (
      <div className="flex items-center justify-center grow">
        <Spin></Spin>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 grow">
        <p>Načítání číselníku selhalo</p>
      </div>
    );
  }
}
