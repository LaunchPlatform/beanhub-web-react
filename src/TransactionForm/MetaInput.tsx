import React, { FunctionComponent } from "react";

export interface Props {
  readonly defaultKey?: string;
  readonly keyError?: string;
  readonly defaultValue?: string;
  readonly valueError?: string;
  readonly index: number;
  readonly onKeyChange?: (key: string) => void;
  readonly onValueChange?: (key: string) => void;
}

const MetaInput: FunctionComponent<Props> = ({
  defaultKey,
  keyError,
  defaultValue,
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
        defaultValue={defaultKey}
        onChange={(event) => onKeyChange?.(event.target.value)}
        style={{ width: "20em", flexGrow: 0 }}
      />
      <div className="input-group-append input-group-prepend">
        <div className="input-group-text">:</div>
      </div>
      <input
        type="text"
        aria-label="Value"
        className={
          "form-control" + (valueError !== undefined ? " is-invalid" : "")
        }
        placeholder="Value"
        name={`meta-${index}-value`}
        defaultValue={defaultValue}
        onChange={(event) => onValueChange?.(event.target.value)}
        style={{
          flexGrow: 1,
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
