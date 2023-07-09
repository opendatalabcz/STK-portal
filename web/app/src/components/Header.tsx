"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { Rubik } from "next/font/google";

const rubik = Rubik({ subsets: ["latin"] });

export default function Header() {
  return (
    <header
      className={`flex flex-row items-baseline px-4 py-3 bg-gray-100 text-slate-600 ${rubik.className}`}
    >
      <div className="flex flex-row items-baseline pr-16 space-x-4">
        <Image
          src="./logo.svg"
          alt="logo"
          width="26"
          height="26"
          className="self-center"
        ></Image>
        <Link href="/">
          <h1 className="text-2xl font-medium text-slate-900">STK Portál</h1>
        </Link>
      </div>
      <nav className="flex flex-row items-baseline space-x-8">
        <HeaderLink href="/stations">Stanice</HeaderLink>
        <HeaderLink href="/vehicles">Vozidla</HeaderLink>
        <HeaderLink href="/compare">Srovnání</HeaderLink>
      </nav>
    </header>
  );
}

export function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="text-lg hover:text-slate-900">
      {children}
    </Link>
  );
}
