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
      className="px-4 h-12 text-white bg-red-500 rounded outline-none grow focus:bg-red-600 hover:bg-red-600"
      {...props}
    >
      {children}
    </MuiButton>
  );
}
