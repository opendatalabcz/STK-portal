import Button from "antd/es/button";
import Input from "antd/es/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({ initialValue }: { initialValue?: string }) {
  const router = useRouter();

  const [value, setValue] = useState(initialValue ?? "");

  function submit() {
    if (value.length == 0) return;
    router.push(`/vehicles/search?q=${value}`);
  }

  return (
    <div className="flex flex-row justify-start space-x-4 md:w-8/12">
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            submit();
          }
        }}
        placeholder="VIN (min. 10 znaků)"
      ></Input>

      <Button type="primary" size="large" onClick={submit}>
        Hledat
      </Button>
    </div>
  );
}