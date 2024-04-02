import React, { useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";
import type { SelectProps } from "antd";
import { debounce } from "lodash";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (make: string, model: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any
>({
  fetchOptions,
  debounceTimeout = 800,
  make,
  ...props
}: { make: string | undefined } & DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(make ?? "", value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout, make]);

  return (
    <Select
      disabled={make == undefined}
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

// Usage of DebounceSelect
interface UserValue {
  label: string;
  value: string;
}

async function fetchModelList(
  make: string,
  model: string
): Promise<UserValue[]> {
  const res = await fetch(`/api/models?make=eq.${make}&model=ilike.*${model}*`);
  const body: { make: string; model: string }[] = await res.json();

  // Sort in proper Czech order.
  var defColl = new Intl.Collator("cs-CZ");
  body.sort((a, b) => defColl.compare(a.model, b.model));

  const result: UserValue[] = [];

  body.forEach((item) => {
    if (result.find((value) => value.label == item.model) == null) {
      result.push({
        label: item.model,
        value: item.model,
      });
    }
  });

  return result;
}

export default function ModelInput({
  make,
  value,
  onChange,
}: {
  make?: string;
  value?: string;
  onChange: (make: string) => void;
}) {
  return (
    <DebounceSelect
      value={{ label: value ?? "", value: value ?? "" }}
      placeholder="Model"
      fetchOptions={fetchModelList}
      onChange={(newValue) => {
        const x = newValue.toString();
        onChange(x);
      }}
      style={{ width: "100%" }}
      make={make}
    />
  );
}
