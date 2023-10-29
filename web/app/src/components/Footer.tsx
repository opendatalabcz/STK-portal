"use client";

import { Footer as AntFooter } from "antd/es/layout/layout";
import { GithubOutlined } from "@ant-design/icons";
import Image from "next/image";
import theme from "antd/es/theme";

export default function Footer() {
  const {
    token: { colorSplit },
  } = theme.useToken();

  return (
    <AntFooter
      className="flex flex-col items-center justify-center px-4 py-2 space-y-6"
      style={{
        borderTop: "1px",
        borderTopColor: colorSplit,
        borderTopStyle: "solid",
      }}
    >
      <div>
        <p>
          &copy;&nbsp;
          <a
            href="https://opendatalab.cz/"
            target="_blank"
            className="underline underline-offset-2 decoration-dotted decoration-1"
          >
            OpenDataLab
          </a>{" "}
          2023, portál vznikl jako{" "}
          <a
            href=""
            target="_blank"
            className="underline underline-offset-2 decoration-dotted decoration-1"
          >
            diplomová práce
          </a>{" "}
          na{" "}
          <a
            href="https://fit.cvut.cz/"
            target="_blank"
            className="underline underline-offset-2 decoration-dotted decoration-1"
          >
            FIT ČVUT
          </a>
        </p>
      </div>

      <div className="flex flex-row items-center space-x-10">
        <a href="https://opendatalab.cz/" target="_blank">
          <Image
            src={"/logo-odl.svg"}
            width={64}
            height={64}
            alt={"Logo OpenDataLab"}
          ></Image>
        </a>
        <a href="https://fit.cvut.cz/" target="_blank">
          <Image
            src={"/logo-fit.svg"}
            width={160}
            height={64}
            alt={"Logo FIT ČVUT"}
          ></Image>
        </a>
        <a href="https://github.com/opendatalabcz/STK-portal" target="_blank">
          <GithubOutlined className="text-4xl" style={{ color: "black" }} />
        </a>
      </div>
    </AntFooter>
  );
}
