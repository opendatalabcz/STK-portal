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
        <Content className="flex flex-col items-stretch p-4 space-y-4">
          {children}
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
  );
}
