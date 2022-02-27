import React, { FunctionComponent, useEffect } from "react";
import PostingCandidateList from "./PostingCandidateList";

export interface Candidate {
  readonly prefix: string;
  readonly suffix: string;
  readonly account: string;
}

export interface Props {
  readonly account?: string;
  readonly unitNumber?: string;
  readonly unitCurrency?: string;
  readonly candidates?: Array<Candidate>;
  readonly index: number;
  readonly onAccountChange?: (value: string) => void;
  readonly onUnitNumberChange?: (value: string) => void;
  readonly onUnitCurrencyChange?: (value: string) => void;
  readonly onDelete?: () => void;
}

const PostingInput: FunctionComponent<Props> = ({
  account,
  unitNumber,
  unitCurrency,
  index,
  candidates,
  onAccountChange,
  onUnitNumberChange,
  onUnitCurrencyChange,
  onDelete,
}: Props) => {
  return (
    <div className="input-group">
      <div className="position-relative">
        <input
          type="text"
          aria-label="Account"
          className="form-control"
          placeholder="Account"
          name={`postings-${index}-account`}
          value={account}
          onChange={(event) => onAccountChange?.(event.target.value)}
        />
        {candidates !== undefined ? (
          <PostingCandidateList
            candidates={candidates.map((item) => ({
              account: item.account,
              prefix: item.prefix,
              suffix: item.suffix,
            }))}
          />
        ) : null}
      </div>
      <input
        type="number"
        aria-label="Unit Number"
        className="form-control"
        placeholder="12.34"
        name={`postings-${index}-number`}
        value={unitNumber}
        onChange={(event) => onUnitNumberChange?.(event.target.value)}
      />
      <input
        type="text"
        aria-label="Unit Currency"
        className="form-control"
        placeholder="USD"
        name={`postings-${index}-currency`}
        value={unitCurrency}
        onChange={(event) => onUnitCurrencyChange?.(event.target.value)}
      />
      <div className="input-group-append">
        <button
          type="button"
          className="btn btn-outline-default delete-button"
          onClick={onDelete}
        >
          <i className="fal fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default PostingInput;
