"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ConfigProvider from "antd/es/config-provider";
import Layout, { Content } from "antd/es/layout/layout";
import theme from "./themeConfig";
import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ConfigProvider theme={theme}>
      <Layout>
        <Header></Header>
        <Content className="p-4">
          <p className="text-lg">Chyba aplikace.</p>
          <br />
          <Link href="/">Domů</Link>
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
  );
}
