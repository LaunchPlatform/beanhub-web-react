import React, { FunctionComponent, KeyboardEvent } from "react";
import PostingCandidateList, { MatchedText } from "./PostingCandidateList";

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
      <div
        className={
          "form-control-wrapper position-relative" +
          (isInvalid ? " is-invalid" : "")
        }
        style={{ flex: 2 }}
      >
        <input
          type="text"
          aria-label="Key"
          className={
            "form-control" + (keyError !== undefined ? " is-invalid" : "")
          }
          placeholder="Account"
          name={`meta-${index}-account`}
          value={key}
          onChange={(event) => onKeyChange?.(event.target.value)}
          style={{}}
        />
      </div>
    </div>
  );
};

export default MetaInput;
