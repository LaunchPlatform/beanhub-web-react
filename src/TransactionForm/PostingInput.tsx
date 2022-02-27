import React, { FunctionComponent, KeyboardEvent } from "react";
import PostingCandidateList from "./PostingCandidateList";

export interface Candidate {
  readonly prefix: string;
  readonly suffix: string;
  readonly account: string;
}

export interface Props {
  readonly account: string;
  readonly unitNumber: string;
  readonly unitCurrency: string;
  readonly accountCandidates?: Array<Candidate>;
  readonly accountCandidateIndex: number;
  readonly index: number;
  readonly onAccountChange?: (value: string) => void;
  readonly onAccountKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void;
  readonly onAccountKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  readonly onAccountBlur?: () => void;
  readonly onUnitNumberChange?: (value: string) => void;
  readonly onUnitCurrencyChange?: (value: string) => void;
  readonly onAccountCandidateClick?: (value: string) => void;
  readonly onDelete?: () => void;
}

const PostingInput: FunctionComponent<Props> = ({
  account,
  unitNumber,
  unitCurrency,
  index,
  accountCandidates,
  accountCandidateIndex,
  onAccountChange,
  onAccountKeyPress,
  onAccountKeyDown,
  onAccountBlur,
  onUnitNumberChange,
  onUnitCurrencyChange,
  onAccountCandidateClick,
  onDelete,
}: Props) => {
  return (
    <div className="input-group">
      <div
        className="form-control-wrapper position-relative"
        style={{ marginLeft: -10, flex: 2 }}
      >
        <input
          type="text"
          aria-label="Account"
          className="form-control"
          placeholder="Account"
          name={`postings-${index}-account`}
          value={account}
          onChange={(event) => onAccountChange?.(event.target.value)}
          onKeyDown={(event) => onAccountKeyDown?.(event)}
          onKeyPress={(event) => onAccountKeyPress?.(event)}
          onBlur={() => onAccountBlur?.()}
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        {accountCandidates !== undefined ? (
          <PostingCandidateList
            style={{ position: "absolute", width: "100%" }}
            activeIndex={accountCandidateIndex}
            candidates={accountCandidates.map((item) => ({
              account: item.account,
              prefix: item.prefix,
              suffix: item.suffix,
            }))}
            onClick={(value) => onAccountCandidateClick?.(value)}
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
        style={{ marginLeft: -1 }}
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
