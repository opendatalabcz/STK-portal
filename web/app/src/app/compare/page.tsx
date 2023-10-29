"use client";

import ConfigProvider from "antd/es/config-provider";
import theme from "../themeConfig";
import Layout from "antd/es/layout";
import Header from "@/components/Header";
import { Content } from "antd/es/layout/layout";
import Footer from "@/components/Footer";
import Button from "antd/es/button";
import Card from "antd/es/card";
import Input from "antd/es/input";

export default function ComparePage() {
  return (
    <ConfigProvider theme={theme}>
      <Layout>
        <Header></Header>
        <Content className="flex flex-col items-stretch p-4 space-y-4">
          <h1 className="text-3xl">Srovnání vozidel</h1>

          <p>
            Srovnávač vozidel umožňuje porovnat buď jednotlivá vozidla podle
            VIN, nebo obecně značky a modely.
          </p>

          <div className="flex flex-col space-y-4 items-left md:w-1/2">
            <Input placeholder="Model, značka nebo VIN" autoFocus></Input>
            <Input placeholder="Model, značka nebo VIN"></Input>

            <div className="flex justify-center">
              <Button type="primary">Porovnat vozidla</Button>
            </div>
          </div>
          <div></div>

          <Card>Výsledek 1</Card>
          <Card>Výsledek 2</Card>
          <Card>Výsledek 3</Card>
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
    // <main className="flex flex-col items-stretch p-4 space-y-4">
    //   {/* <h1 className={`${rubik.className} text-4xl py-2`}>Srovnání vozidel</h1>

    //

    //   </div> */}
    // </main>
  );
}
