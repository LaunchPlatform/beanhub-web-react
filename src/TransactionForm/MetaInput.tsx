import React, { FunctionComponent } from "react";

export interface Props {
  readonly metaKey?: string;
  readonly defaultMetaKey?: string;
  readonly keyDisabled?: boolean;
  readonly metaKeyError?: string;
  readonly metaValue?: string;
  readonly defaultMetaValue?: string;
  readonly valueDisabled?: boolean;
  readonly metaValueError?: string;
  readonly index: number;
  readonly onKeyChange?: (key: string) => void;
  readonly onValueChange?: (key: string) => void;
  readonly onDelete?: () => void;
}

const MetaInput: FunctionComponent<Props> = ({
  metaKey,
  defaultMetaKey,
  keyDisabled,
  metaKeyError,
  metaValue,
  defaultMetaValue,
  valueDisabled,
  metaValueError,
  index,
  onKeyChange,
  onValueChange,
  onDelete,
}: Props) => {
  const isInvalid = [metaKeyError, metaValueError].some(
    (value) => value !== undefined
  );
  return (
    <div className="input-group">
      <input
        type="text"
        aria-label="Key"
        className={
          "form-control" + (metaKeyError !== undefined ? " is-invalid" : "")
        }
        placeholder="Key"
        name={`metadata-${index}-key`}
        value={metaKey}
        defaultValue={defaultMetaKey}
        disabled={keyDisabled}
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
          "form-control" + (metaValueError !== undefined ? " is-invalid" : "")
        }
        placeholder="Value"
        name={`metadata-${index}-value`}
        value={metaValue}
        defaultValue={defaultMetaValue}
        disabled={valueDisabled}
        onChange={(event) => onValueChange?.(event.target.value)}
        style={{
          flexGrow: 1,
        }}
      />
      <div className="input-group-append">
        <button
          type="button"
          className="btn btn-outline-default"
          onClick={onDelete}
        >
          <i className="fal fa-trash-alt"></i>
        </button>
      </div>
      {isInvalid ? (
        <div className="invalid-feedback">
          {[metaKeyError, metaValueError]
            .filter((value) => value !== undefined)
            .join(", ")}
        </div>
      ) : null}
    </div>
  );
};

export default MetaInput;
