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
    <AntFooter className="flex flex-col items-center justify-center px-4 py-2 space-y-6">
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
          2024, portál vznikl jako{" "}
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

      <div className="flex flex-row flex-wrap items-center md:space-x-5">
        <a href="https://opendatalab.cz/" target="_blank">
          <Image
            className="mx-4"
            src={"/logo-odl.svg"}
            width={64}
            height={64}
            alt={"Logo OpenDataLab"}
          ></Image>
        </a>
        <a href="https://fit.cvut.cz/" target="_blank">
          <Image
            className="mx-4"
            src={"/logo-fit.svg"}
            width={160}
            height={64}
            alt={"Logo FIT ČVUT"}
          ></Image>
        </a>
        <a href="https://profinit.eu/" target="_blank">
          <Image
            className="mx-4"
            src={"/logo-profinit.png"}
            width={150}
            height={64}
            alt={"Logo Profinit"}
          ></Image>
        </a>
        <a href="https://github.com/opendatalabcz/STK-portal" target="_blank">
          <GithubOutlined
            className="mx-4 text-4xl"
            style={{ color: "black" }}
          />
        </a>
      </div>
    </AntFooter>
  );
}
