"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Menu from "antd/es/menu";
import { Header as AntHeader } from "antd/es/layout/layout";
import theme from "antd/es/theme";
import { useEffect, useState } from "react";

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        // @ts-ignore
        width: window.innerWidth,
        // @ts-ignore
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function Header() {
  const {
    token: { colorBgLayout, colorSplit },
  } = theme.useToken();

  const router = useRouter();
  const firstLevelPath = usePathname().split("/")[1];
  const size = useWindowSize();

  return (
    <AntHeader
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10000, // Fixes overlapping maps and its controls.
        // width: "100%",
        display: "flex",
        alignItems: "center",
        // background: colorBgLayout,
        // borderBottom: "1px",
        // borderBottomColor: colorSplit,
        // borderBottomStyle: "solid",
      }}
    >
      <div className="flex flex-row pr-8 md:pr-16">
        <Link className="flex flex-row space-x-4" href="/">
          <Image
            src="/logo.svg"
            alt="logo"
            width="26"
            height="26"
            className="self-center"
          ></Image>
          <h1
            // @ts-ignore
            hidden={size.width < 500}
            className="font-medium text-white sm:text-2xl"
          >
            STK Portál
          </h1>
        </Link>
      </div>
      {/* 
      <div className="grow"> */}
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
          {
            key: "about",
            label: "O projektu",
          },
        ]}
      />
      {/* </div> */}
    </AntHeader>
  );
}
