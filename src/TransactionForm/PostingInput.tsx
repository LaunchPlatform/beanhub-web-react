import React, { FunctionComponent, useEffect } from "react";

export interface Props {
  readonly account?: string;
  readonly unitNumber?: string;
  readonly unitCurrency?: string;
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
  onAccountChange,
  onUnitNumberChange,
  onUnitCurrencyChange,
  onDelete,
}: Props) => {
  return (
    <div className="input-group">
      <div className="posting-account-container position-relative">
        <input
          type="text"
          aria-label="Account"
          className="form-control posting-account"
          placeholder="Account"
          name={`postings-${index}-account`}
          value={account}
          onChange={(event) => onAccountChange?.(event.target.value)}
        />
      </div>
      <input
        type="number"
        aria-label="Unit Number"
        className="form-control posting-number"
        placeholder="12.34"
        name={`postings-${index}-number`}
        value={unitNumber}
        onChange={(event) => onUnitNumberChange?.(event.target.value)}
      />
      <input
        type="text"
        aria-label="Unit Currency"
        className="form-control posting-currency"
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
