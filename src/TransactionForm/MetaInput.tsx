import React, { FunctionComponent } from "react";

export interface Props {
  readonly metaKey?: string;
  readonly defaultMetaKey?: string;
  readonly metaKeyError?: string;
  readonly metaValue?: string;
  readonly defaultMetaValue?: string;
  readonly metaValueError?: string;
  readonly index: number;
  readonly onKeyChange?: (key: string) => void;
  readonly onValueChange?: (key: string) => void;
  readonly onDelete?: (key: string) => void;
}

const MetaInput: FunctionComponent<Props> = ({
  metaKey,
  defaultMetaKey,
  metaKeyError,
  metaValue,
  defaultMetaValue,
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
        name={`meta-${index}-key`}
        value={metaKey}
        defaultValue={defaultMetaKey}
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
        name={`meta-${index}-value`}
        value={metaValue}
        defaultValue={defaultMetaValue}
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
          {[metaValueError, metaValueError]
            .filter((value) => value !== undefined)
            .join(", ")}
        </div>
      ) : null}
    </div>
  );
};

export default MetaInput;
