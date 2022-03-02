import React, { FunctionComponent, KeyboardEvent } from "react";
import PostingCandidateList from "./PostingCandidateList";

export interface Candidate {
  readonly prefix: string;
  readonly suffix: string;
  readonly value: string;
}

export interface Props {
  readonly account: string;
  readonly accountCandidates?: Array<Candidate>;
  readonly accountCandidateIndex?: number;
  readonly accountError?: string;
  readonly unitNumber: string;
  readonly unitNumberError?: string;
  readonly unitCurrency: string;
  readonly unitCurrencyCandidates?: Array<Candidate>;
  readonly unitCurrencyCandidateIndex?: number;
  readonly unitCurrencyError?: string;
  readonly index: number;
  readonly onAccountChange?: (value: string) => void;
  readonly onAccountKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void;
  readonly onAccountKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  readonly onAccountBlur?: () => void;
  readonly onAccountCandidateClick?: (value: string) => void;
  readonly onUnitNumberChange?: (value: string) => void;
  readonly onUnitCurrencyChange?: (value: string) => void;
  readonly onUnitCurrencyKeyPress?: (
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  readonly onUnitCurrencyKeyDown?: (
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  readonly onUnitCurrencyBlur?: () => void;
  readonly onUnitCurrencyCandidateClick?: (value: string) => void;
  readonly onDelete?: () => void;
}

const PostingInput: FunctionComponent<Props> = ({
  account,
  accountCandidates,
  accountCandidateIndex,
  accountError,
  unitNumber,
  unitNumberError,
  unitCurrency,
  unitCurrencyCandidates,
  unitCurrencyCandidateIndex,
  unitCurrencyError,
  index,
  onAccountChange,
  onAccountKeyPress,
  onAccountKeyDown,
  onAccountBlur,
  onAccountCandidateClick,
  onUnitNumberChange,
  onUnitCurrencyChange,
  onUnitCurrencyKeyPress,
  onUnitCurrencyKeyDown,
  onUnitCurrencyBlur,
  onUnitCurrencyCandidateClick,
  onDelete,
}: Props) => {
  const isInvalid = [accountError, unitNumberError, unitCurrencyError].some(
    (value) => value !== undefined
  );
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
          aria-label="Account"
          className={
            "form-control" + (accountError !== undefined ? " is-invalid" : "")
          }
          placeholder="Account"
          name={`postings-${index}-account`}
          value={account}
          onChange={(event) => onAccountChange?.(event.target.value)}
          onKeyPress={(event) => onAccountKeyPress?.(event)}
          onKeyDown={(event) => onAccountKeyDown?.(event)}
          onBlur={() => onAccountBlur?.()}
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            ...(accountCandidates !== undefined
              ? {
                  borderBottomLeftRadius: 0,
                }
              : {}),
            ...(accountError !== undefined
              ? {
                  zIndex: 1,
                  position: "relative",
                }
              : {}),
          }}
        />
        {accountCandidates !== undefined ? (
          <PostingCandidateList
            style={{ position: "absolute", width: "100%", zIndex: 1 }}
            activeIndex={accountCandidateIndex ?? 0}
            candidates={accountCandidates.map(
              (item) =>
                ({
                  value: item.value,
                  prefix: item.prefix,
                  suffix: item.suffix,
                } as Candidate)
            )}
            onClick={(value) => onAccountCandidateClick?.(value)}
          />
        ) : null}
      </div>
      <input
        type="number"
        aria-label="Unit Number"
        className={
          "form-control" + (unitNumberError !== undefined ? " is-invalid" : "")
        }
        placeholder="12.34"
        name={`postings-${index}-number`}
        value={unitNumber}
        onChange={(event) => onUnitNumberChange?.(event.target.value)}
        style={{
          marginLeft: -1,
          ...(unitNumberError !== undefined
            ? {
                zIndex: 1,
                position: "relative",
              }
            : {}),
        }}
      />
      <div
        className="form-control-wrapper position-relative"
        style={{ marginLeft: -1, flex: 1 }}
      >
        <input
          type="text"
          aria-label="Unit Currency"
          className={
            "form-control" +
            (unitCurrencyError !== undefined ? " is-invalid" : "")
          }
          placeholder="USD"
          name={`postings-${index}-currency`}
          value={unitCurrency}
          onChange={(event) => onUnitCurrencyChange?.(event.target.value)}
          onKeyPress={(event) => onUnitCurrencyKeyDown?.(event)}
          onKeyDown={(event) => onUnitCurrencyKeyPress?.(event)}
          onBlur={() => onUnitCurrencyBlur?.()}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            ...(unitCurrencyError !== undefined
              ? {
                  zIndex: 1,
                  position: "relative",
                }
              : {}),
          }}
        />
        {unitCurrencyCandidates !== undefined ? (
          <PostingCandidateList
            style={{ position: "absolute", width: "100%", zIndex: 1 }}
            activeIndex={unitCurrencyCandidateIndex ?? 0}
            candidates={unitCurrencyCandidates.map(
              (item) =>
                ({
                  value: item.value,
                  prefix: item.prefix,
                  suffix: item.suffix,
                } as Candidate)
            )}
            onClick={(value) => onUnitCurrencyCandidateClick?.(value)}
          />
        ) : null}
      </div>
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
          {[accountError, unitNumberError, unitCurrencyError]
            .filter((value) => value !== undefined)
            .join(", ")}
        </div>
      ) : null}
    </div>
  );
};

export default PostingInput;
