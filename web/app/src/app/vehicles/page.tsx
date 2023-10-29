"use client";

import AverageAgeChart from "./changes_in_time/average_age";
import Layout, { Content } from "antd/es/layout/layout";
import { Button, ConfigProvider, Input } from "antd";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Card from "antd/es/card/Card";
import theme from "../themeConfig";

export default function VehiclesPage() {
  return (
    <ConfigProvider theme={theme}>
      <Layout>
        <Header></Header>
        <Content className="flex flex-col items-stretch p-4 space-y-4">
          <h1 className="text-3xl">Vozidla</h1>

          <div className="flex flex-row justify-start space-x-4 md:w-1/2">
            <Input placeholder="VIN, značka, model, rok výroby..."></Input>
            <Button type="primary" size="large">
              Hledat
            </Button>
          </div>

          <h1 className="pt-4 text-3xl">Statistiky</h1>

          <h2 className="pt-4 text-2xl">Proměny vozového parku v čase</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            <Card>
              <h3 className="text-lg">Průměrný věk osobních automobilů</h3>
              <AverageAgeChart></AverageAgeChart>
            </Card>
          </div>
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
  );
}
