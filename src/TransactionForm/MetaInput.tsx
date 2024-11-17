import React, { FunctionComponent } from "react";

export interface Props {
  readonly key?: string;
  readonly keyError?: string;
  readonly value?: string;
  readonly valueError?: string;
  readonly index: number;
  readonly onKeyChange?: (key: string) => void;
  readonly onValueChange?: (key: string) => void;
}

const MetaInput: FunctionComponent<Props> = ({
  key,
  keyError,
  value,
  valueError,
  index,
  onKeyChange,
  onValueChange,
}: Props) => {
  const isInvalid = [keyError, valueError].some((value) => value !== undefined);
  return (
    <div className="input-group">
      <input
        type="text"
        aria-label="Key"
        className={
          "form-control" + (keyError !== undefined ? " is-invalid" : "")
        }
        placeholder="Key"
        name={`meta-${index}-key`}
        value={key}
        onChange={(event) => onKeyChange?.(event.target.value)}
        style={{ width: "20em", flexGrow: 0 }}
      />
      <div className="input-group-append input-group-prepend">
        <div className="input-group-text">:</div>
      </div>
      <input
        type="number"
        aria-label="Value"
        className={
          "form-control" + (valueError !== undefined ? " is-invalid" : "")
        }
        placeholder="Value"
        name={`meta-${index}-value`}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        style={{
          flexGrow: 1,
          marginLeft: -1,
          ...(valueError !== undefined
            ? {
                zIndex: 1,
                position: "relative",
              }
            : {}),
        }}
      />
      {isInvalid ? (
        <div className="invalid-feedback">
          {[keyError, valueError]
            .filter((value) => value !== undefined)
            .join(", ")}
        </div>
      ) : null}
    </div>
  );
};

export default MetaInput;
