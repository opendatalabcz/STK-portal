import Card from "antd/es/card";
import SearchBox from "./SearchBox";
import Container from "@/components/Container";
import BreadcrumbsContainer from "@/components/BreadcrumbsContainer";
import { Breadcrumb, Spin } from "antd";
import Link from "next/link";
import TotalInspectionsByResultChart from "./inspection-by-result/AverageInspectionResultChart";
import InspectionResultByTopMake from "./inspection-result-by-make/InspectionResultByTopMake";
import InspectionResultByTopModel from "./inspection-result-by-model/InspectionResultByTopModel";
import DefectsByCategoryLatestYearChart from "./top-defects-by-category/DefectsByCategoryLatestYearChart";
import TopDefectsLatestYearChart from "./top-defects/TopDefectsLatestYearChart";
import InspectionFailureReasonsPreview from "./inspection-failure-reasons/InspectionFailureReasonsPreview";
import AverageInspectionCountBySeverityChart from "./average-inspection-count-by-severity/AverageInspectionCountBySeverityChart";
import AnomalousInspectionsChart from "./anomalous-inspections/AnomalousInspectionsChart";
import InspectionsOnFrequentDaysChart from "./anomalous-inspections-on-frequent-days/InspectionsOnFrequentDaysChart";
import InspectionsWithDissapearingFailuresChart from "./anomalous-inspections-disappearing-failures/InspectionsWithDissapearingFailuresChart";
import RepeatedInspectionsChart from "./anomalous-inspections-repeated-success/RepeatedInspectionsChart";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stanice - STK Portál",
};

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <Card>
      <div className="flex items-center justify-center h-96 grow">
        <Spin></Spin>
      </div>
    </Card>
  ),
});

export default function StationsPage() {
  return (
    <>
      <BreadcrumbsContainer>
        <Breadcrumb
          items={[
            { title: <Link href="/">STK portál</Link> },
            { title: "Stanice" },
          ]}
        ></Breadcrumb>
      </BreadcrumbsContainer>

      <Container>
        <h1 className="pb-4 text-3xl">Stanice</h1>

        <div className="pb-4">
          <SearchBox></SearchBox>
        </div>

        <Map></Map>

        <h1 className="pt-8 pb-4 text-3xl">Souhrnné statistiky</h1>

        <Card size="small" title="Obsah">
          <ul className="pl-5 list-disc">
            <li>
              <a href="#average-results">Průměrné výsledky kontrol</a>
              <ul className="pl-6 list-disc ">
                <li>Počet kontrol podle výsledku</li>
                <li>Poměrný výsledek populárních značek</li>
                <li>Poměrný výsledek populárních modelů</li>
              </ul>
            </li>
            <li>
              <a href="#defects">Závady</a>
              <ul className="pl-6 list-disc ">
                <li>Nejčastější závady podle kategorie</li>
                <li>Nejčastější konkrétní závady</li>
                <li>Nejčastější důvody neúspěšné kontroly</li>
                <li>Průměrný počet závad podle závažnosti</li>
              </ul>
            </li>
            <li>
              <a href="#anomalies">Anomální kontroly</a>
              <ul className="pl-6 list-disc ">
                <li>Podíl všech anomálních kontrol</li>
                <li>Prohlídky v nadměrně vytížených dnech</li>
                <li>Prohlídky s mizejícími závady</li>
                <li>Prohlídky s úspěšným opakováním na jiné stanici</li>
              </ul>
            </li>
          </ul>
        </Card>

        <h2 id="average-results" className="pt-8 text-2xl">
          Průměrné výsledky kontrol
        </h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <TotalInspectionsByResultChart
            linkToDetails
          ></TotalInspectionsByResultChart>
          <InspectionResultByTopMake linkToDetails></InspectionResultByTopMake>
          <InspectionResultByTopModel
            linkToDetails
          ></InspectionResultByTopModel>
        </div>

        <h2 id="defects" className="pt-8 text-2xl">
          Závady
        </h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <DefectsByCategoryLatestYearChart
            linkToDetails
          ></DefectsByCategoryLatestYearChart>
          <TopDefectsLatestYearChart linkToDetails></TopDefectsLatestYearChart>
          <InspectionFailureReasonsPreview
            linkToDetails
          ></InspectionFailureReasonsPreview>
          <AverageInspectionCountBySeverityChart
            linkToDetails
          ></AverageInspectionCountBySeverityChart>
        </div>

        <h2 id="anomalies" className="pt-8 text-2xl">
          Anomální kontroly
        </h2>
        <hr></hr>
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <AnomalousInspectionsChart linkToDetails></AnomalousInspectionsChart>
          <InspectionsOnFrequentDaysChart
            linkToDetails
          ></InspectionsOnFrequentDaysChart>
          <InspectionsWithDissapearingFailuresChart
            linkToDetails
          ></InspectionsWithDissapearingFailuresChart>
          <RepeatedInspectionsChart linkToDetails></RepeatedInspectionsChart>
        </div>
      </Container>
    </>
  );
}
