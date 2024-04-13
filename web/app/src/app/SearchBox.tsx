"use client";

import Button from "antd/es/button";
import Input from "antd/es/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();

  const [value, setValue] = useState("");

  function submit() {
    if (value.length == 0) return;

    // Simple regex to distinguish VIN
    if (RegExp("[A-Z0-9]{17}").test(value)) {
      router.push(`/vehicles/${value}`);
    } else {
      router.push(`/stations/search?q=${value}`);
    }
  }

  return (
    <div className="flex flex-row self-center justify-start py-6 space-x-4 md:w-8/12">
      <Input
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            submit();
          }
        }}
        placeholder="Hledejte VIN nebo stanici TK"
      ></Input>

      <Button type="primary" size="large" onClick={submit}>
        Hledat
      </Button>
    </div>
  );
}
