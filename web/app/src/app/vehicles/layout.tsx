"use client";

import ConfigProvider from "antd/es/config-provider";
import theme from "../themeConfig";
import Layout from "antd/es/layout";
import Header from "@/components/Header";
import { Content } from "antd/es/layout/layout";
import Footer from "@/components/Footer";

export default function StationsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider theme={theme}>
      <Layout>
        <Header></Header>
        <Content className="flex flex-col items-stretch w-full mx-auto lg:w-10/12 2xl:w-8/12">
          {children}
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
  );
}
