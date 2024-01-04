"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Menu from "antd/es/menu";
import { Header as AntHeader } from "antd/es/layout/layout";
import theme from "antd/es/theme";

export default function Header() {
  const {
    token: { colorBgLayout, colorSplit },
  } = theme.useToken();

  const router = useRouter();
  const firstLevelPath = usePathname().split("/")[1];

  return (
    <AntHeader
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10000, // Fixes overlapping maps and its controls.
        width: "100%",
        display: "flex",
        alignItems: "center",
        // background: colorBgLayout,
        // borderBottom: "1px",
        // borderBottomColor: colorSplit,
        // borderBottomStyle: "solid",
      }}
    >
      <div className="flex flex-row items-baseline pr-8 space-x-4 sm:pr-16">
        <Image
          src="/logo.svg"
          alt="logo"
          width="26"
          height="26"
          className="self-center"
        ></Image>
        <Link href="/">
          <h1 className="font-medium text-white sm:text-2xl">STK Portál</h1>
        </Link>
      </div>
      <div className="grow">
        <Menu
          // theme="light"
          theme="dark"
          style={{
            display: "flex",
            alignItems: "center",
            // background: colorBgLayout,
          }}
          mode="horizontal"
          defaultSelectedKeys={[firstLevelPath]}
          onClick={(e) => {
            router.push(`/${e.key}`);
          }}
          items={[
            {
              key: "stations",
              label: "Stanice",
            },
            {
              key: "vehicles",
              label: "Vozidla",
            },
            {
              key: "compare",
              label: "Srovnání",
            },
            {
              key: "defects",
              label: "Číselník závad",
            },
          ]}
        />
      </div>
    </AntHeader>
  );
}
