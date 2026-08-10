import React, { FunctionComponent, useState, useEffect } from "react";
import { getHistoryValue, setHistoryValue } from "../Shared/historyState";
import FormRow from "../Shared/FormRow";
import PostingInputContainer from "./PostingInputContainer";
import { CostMode, PriceMode } from "./PostingInput";
import { computeBalancingAmount } from "./balanceAmount";
import {
  emptyPosting,
  normalizePostingStates,
  postingStatesToRecords,
  PostingRecordState,
} from "./postingState";

export interface PostingRecord {
  readonly account?: string;
  readonly accountError?: string;
  readonly unitNumber?: string;
  readonly unitNumberError?: string;
  readonly unitCurrency?: string;
  readonly unitCurrencyError?: string;
  readonly flag?: string;
  readonly flagError?: string;
  readonly costMode?: CostMode;
  readonly costNumber?: string;
  readonly costNumberError?: string;
  readonly costCurrency?: string;
  readonly costCurrencyError?: string;
  readonly costDate?: string;
  readonly costDateError?: string;
  readonly costLabel?: string;
  readonly costLabelError?: string;
  readonly priceMode?: PriceMode;
  readonly priceNumber?: string;
  readonly priceNumberError?: string;
  readonly priceCurrency?: string;
  readonly priceCurrencyError?: string;
}

export interface Props {
  readonly initialPostings?: Array<PostingRecord>;
  readonly accounts: Array<string>;
  readonly accountCurrencies: Record<string, Array<string>>;
  readonly defaultCurrencies: Array<string>;
  readonly required?: boolean;
  readonly error?: string;
  readonly name: string;
  readonly advanced?: boolean;
  readonly onChange?: (postings: Array<PostingRecord>) => void;
}

const PostingListContainer: FunctionComponent<Props> = ({
  initialPostings,
  accounts,
  accountCurrencies,
  defaultCurrencies,
  required,
  error,
  name,
  advanced,
  onChange,
}: Props) => {
  let filledInitialPostings = initialPostings;
  if (filledInitialPostings !== undefined && filledInitialPostings.length < 2) {
    // Fill up to 2 postings if it's not already
    const toFillCount = 2 - filledInitialPostings.length;
    for (let i = 0; i < toFillCount; i++) {
      filledInitialPostings = [...filledInitialPostings, emptyPosting()];
    }
  }
  // Keep a trailing empty row for adding another posting (same idea as metadata).
  if (
    filledInitialPostings !== undefined &&
    filledInitialPostings.length > 0 &&
    filledInitialPostings.every(
      (item) => (item.account?.trim().length || 0) > 0
    )
  ) {
    filledInitialPostings = [...filledInitialPostings, emptyPosting()];
  }
  let initialState = normalizePostingStates(filledInitialPostings ?? [{}, {}]);
  // Key by field `name` so multi-entry edit forms (and different pages) do not
  // clobber each other via a single global `history.state.postings` slot.
  // Always normalize — older drafts may be plain PostingRecord[] without keys.
  const historyPostings = getHistoryValue<unknown>(name);
  if (historyPostings !== undefined) {
    initialState = normalizePostingStates(historyPostings);
  }
  if (
    initialState.length > 0 &&
    initialState.every((item) => item.account.trim().length > 0)
  ) {
    initialState = [...initialState, emptyPosting()];
  }
  useEffect(() => {
    if (getHistoryValue(name) === undefined) {
      setHistoryValue(name, initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [postingsState, setPostingsState] = useState<Array<PostingRecordState>>(
    initialState
  );
  const updatePostings = (newPostings: Array<PostingRecordState>) => {
    setPostingsState(newPostings);
    setHistoryValue(name, newPostings);
    onChange?.(postingStatesToRecords(newPostings));
  };
  useEffect(() => {
    onChange?.(postingStatesToRecords(postingsState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FormRow title="Postings" required={required ?? false}>
      {postingsState.map((posting, index) => (
        <PostingInputContainer
          key={posting.key}
          name={`${name}-${index}`}
          advanced={advanced}
          account={posting.account}
          accountError={posting.accountError}
          unitNumber={posting.unitNumber}
          unitNumberError={posting.unitNumberError}
          unitNumberUpdateCounter={posting.unitNumberUpdateCounter}
          unitCurrency={posting.unitCurrency}
          unitCurrencyUpdateCounter={posting.unitCurrencyUpdateCounter}
          unitCurrencyError={posting.unitCurrencyError}
          flag={posting.flag}
          flagError={posting.flagError}
          costExpanded={
            !!advanced &&
            postingsState.some((item) => item.costMode !== CostMode.INACTIVE)
          }
          initialCostMode={posting.costMode}
          costNumber={posting.costNumber}
          costNumberError={posting.costNumberError}
          costCurrency={posting.costCurrency}
          costCurrencyUpdateCounter={posting.costCurrencyUpdateCounter}
          costCurrencyError={posting.costCurrencyError}
          costDate={posting.costDate}
          costDateError={posting.costDateError}
          costLabel={posting.costLabel}
          costLabelError={posting.costLabelError}
          priceExpanded={postingsState.some(
            (item) => item.priceMode !== PriceMode.INACTIVE
          )}
          initialPriceMode={posting.priceMode}
          priceNumber={posting.priceNumber}
          priceNumberError={posting.priceNumberError}
          priceCurrency={posting.priceCurrency}
          priceCurrencyUpdateCounter={posting.priceCurrencyUpdateCounter}
          priceCurrencyError={posting.priceCurrencyError}
          accounts={accounts}
          currencies={
            accountCurrencies[posting.account.trim()] ?? defaultCurrencies
          }
          onAccountChange={(account) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              account,
            };
            if (newPostings.every((item) => item.account.trim().length > 0)) {
              // Append a new posting
              newPostings = [...newPostings, emptyPosting()];
            }
            updatePostings(newPostings);
          }}
          onAccountBlur={() => {
            const currencies =
              accountCurrencies[postingsState[index].account.trim()];
            if (currencies === undefined || currencies.length !== 1) {
              return;
            }
            if (postingsState[index].unitCurrency.trim().length !== 0) {
              return;
            }
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              unitCurrency: currencies[0],
              unitCurrencyUpdateCounter:
                (newPostings[index].unitCurrencyUpdateCounter ?? 0) + 1,
            };
            updatePostings(newPostings);
          }}
          onUnitNumberChange={(unitNumber) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              unitNumber,
            };
            updatePostings(newPostings);
          }}
          onFillRemaining={() => {
            const remaining = computeBalancingAmount(postingsState, index);
            if (remaining === null) {
              return;
            }
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              unitNumber: remaining.number,
              unitNumberUpdateCounter:
                (newPostings[index].unitNumberUpdateCounter ?? 0) + 1,
              unitCurrency: remaining.currency,
              unitCurrencyUpdateCounter:
                (newPostings[index].unitCurrencyUpdateCounter ?? 0) + 1,
            };
            updatePostings(newPostings);
          }}
          fillRemainingDisabled={
            computeBalancingAmount(postingsState, index) === null
          }
          onUnitCurrencyChange={(unitCurrency) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              unitCurrency,
            };
            updatePostings(newPostings);
          }}
          onFlagChange={(flag) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              flag,
            };
            updatePostings(newPostings);
          }}
          onCostModeChange={(costMode) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              costMode,
            };
            updatePostings(newPostings);
          }}
          onCostNumberChange={(costNumber) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              costNumber,
            };
            updatePostings(newPostings);
          }}
          onCostCurrencyChange={(costCurrency) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              costCurrency,
            };
            updatePostings(newPostings);
          }}
          onCostDateChange={(costDate) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              costDate,
            };
            updatePostings(newPostings);
          }}
          onCostLabelChange={(costLabel) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              costLabel,
            };
            updatePostings(newPostings);
          }}
          onPriceModeChange={(priceMode) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              priceMode,
            };
            updatePostings(newPostings);
          }}
          onPriceNumberChange={(priceNumber) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              priceNumber,
            };
            updatePostings(newPostings);
          }}
          onPriceCurrencyChange={(priceCurrency) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              priceCurrency,
            };
            updatePostings(newPostings);
          }}
          onDelete={() => {
            if (postingsState.length <= 2) {
              return;
            }
            const newPostings = postingsState.filter(
              (item) => item.key !== posting.key
            );
            updatePostings(newPostings);
          }}
        />
      ))}
      {error !== undefined ? (
        <div>
          <div className="is-invalid"></div>
          <div className="invalid-feedback">{error}</div>
        </div>
      ) : null}
    </FormRow>
  );
};

export default PostingListContainer;
