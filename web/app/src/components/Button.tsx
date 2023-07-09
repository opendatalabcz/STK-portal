"use client";

import { ReactNode } from "react";
import MuiButton from "@mui/base/Button";

export default function Button({
  children,
  ...props
}: {
  children: ReactNode;
}) {
  return (
    <MuiButton
      className="px-4 h-12 bg-gray-100 rounded outline-none select-none grow focus:border-red-600 focus:bg-red-100 focus:text-red-600 hover:bg-gray-200"
      {...props}
    >
      {children}
    </MuiButton>
  );
}
