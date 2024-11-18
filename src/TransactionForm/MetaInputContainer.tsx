import React, { FunctionComponent, useState } from "react";
import MetaInput from "./MetaInput";

export interface Props {
  readonly index: number;
  readonly metaKey?: string;
  readonly metaKeyError?: string;
  readonly metaValue?: string;
  readonly metaValueError?: string;
  readonly onKeyChange?: (value: string) => void;
  readonly onValueChange?: (value: string) => void;
  readonly onDelete?: () => void;
}

const MetaInputContainer: FunctionComponent<Props> = ({
  metaKey,
  metaKeyError,
  metaValue,
  metaValueError,
  index,
  onKeyChange,
  onValueChange,
  onDelete,
}: Props) => {
  const [metaKeyValue, setMetaKey] = useState<string>(metaKey ?? "");
  const [metaValueValue, setMetaValue] = useState<string>(metaValue ?? "");
  return (
    <MetaInput
      index={index}
      onDelete={onDelete}
      metaKey={metaKeyValue}
      metaKeyError={metaKeyError}
      metaValue={metaValueValue}
      metaValueError={metaValueError}
      onKeyChange={(value) => {
        setMetaKey(value);
        onKeyChange?.(value);
      }}
      onValueChange={(value) => {
        setMetaValue(value);
        onValueChange?.(value);
      }}
    />
  );
};

export default MetaInputContainer;
