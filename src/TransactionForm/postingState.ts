import { v4 as uuid } from "uuid";
import { CostMode, PriceMode } from "./PostingInput";
import { PostingRecord } from "./PostingListContainer";

export interface PostingRecordState {
  readonly key: string;
  readonly account: string;
  readonly accountError?: string;
  readonly unitNumber: string;
  readonly unitNumberError?: string;
  readonly unitNumberUpdateCounter?: number;
  readonly unitCurrency: string;
  readonly unitCurrencyUpdateCounter?: number;
  readonly unitCurrencyError?: string;
  readonly flag: string;
  readonly flagError?: string;
  readonly costMode: CostMode;
  readonly costNumber: string;
  readonly costNumberError?: string;
  readonly costCurrency: string;
  readonly costCurrencyUpdateCounter?: number;
  readonly costCurrencyError?: string;
  readonly costDate: string;
  readonly costDateError?: string;
  readonly costLabel: string;
  readonly costLabelError?: string;
  readonly priceMode: PriceMode;
  readonly priceNumber: string;
  readonly priceNumberError?: string;
  readonly priceCurrency: string;
  readonly priceCurrencyUpdateCounter?: number;
  readonly priceCurrencyError?: string;
}

function text(value: unknown): string {
  if (value == null) {
    return "";
  }
  return String(value);
}

function costModeOf(value: unknown): CostMode {
  if (
    value === CostMode.COST ||
    value === CostMode.TOTAL_COST ||
    value === CostMode.EXPANDED ||
    value === CostMode.INACTIVE
  ) {
    return value;
  }
  return CostMode.INACTIVE;
}

function priceModeOf(value: unknown): PriceMode {
  if (
    value === PriceMode.PRICE ||
    value === PriceMode.TOTAL_PRICE ||
    value === PriceMode.EXPANDED ||
    value === PriceMode.INACTIVE
  ) {
    return value;
  }
  return PriceMode.INACTIVE;
}

/** Normalize history / server posting rows into UI state (always has `key`). */
export function normalizePostingState(posting: unknown): PostingRecordState {
  const row = (posting ?? {}) as Partial<PostingRecordState & PostingRecord> & {
    key?: string;
  };
  return {
    key: row.key && String(row.key).length > 0 ? String(row.key) : uuid(),
    account: text(row.account),
    accountError: row.accountError,
    unitNumber: text(row.unitNumber),
    unitNumberError: row.unitNumberError,
    unitNumberUpdateCounter: row.unitNumberUpdateCounter,
    unitCurrency: text(row.unitCurrency),
    unitCurrencyUpdateCounter: row.unitCurrencyUpdateCounter,
    unitCurrencyError: row.unitCurrencyError,
    flag: text(row.flag),
    flagError: row.flagError,
    costMode: costModeOf(row.costMode),
    costNumber: text(row.costNumber),
    costNumberError: row.costNumberError,
    costCurrency: text(row.costCurrency),
    costCurrencyUpdateCounter: row.costCurrencyUpdateCounter,
    costCurrencyError: row.costCurrencyError,
    costDate: text(row.costDate),
    costDateError: row.costDateError,
    costLabel: text(row.costLabel),
    costLabelError: row.costLabelError,
    priceMode: priceModeOf(row.priceMode),
    priceNumber: text(row.priceNumber),
    priceNumberError: row.priceNumberError,
    priceCurrency: text(row.priceCurrency),
    priceCurrencyUpdateCounter: row.priceCurrencyUpdateCounter,
    priceCurrencyError: row.priceCurrencyError,
  };
}

export function normalizePostingStates(
  postings: unknown
): Array<PostingRecordState> {
  if (!Array.isArray(postings)) {
    return [];
  }
  return postings.map(normalizePostingState);
}

export function postingStatesToRecords(
  postings: Array<PostingRecordState>
): Array<PostingRecord> {
  return postings.map((posting) => ({
    account: posting.account,
    accountError: posting.accountError,
    unitNumber: posting.unitNumber,
    unitNumberError: posting.unitNumberError,
    unitCurrency: posting.unitCurrency,
    unitCurrencyError: posting.unitCurrencyError,
    flag: posting.flag,
    flagError: posting.flagError,
    costMode: posting.costMode,
    costNumber: posting.costNumber,
    costNumberError: posting.costNumberError,
    costCurrency: posting.costCurrency,
    costCurrencyError: posting.costCurrencyError,
    costDate: posting.costDate,
    costDateError: posting.costDateError,
    costLabel: posting.costLabel,
    costLabelError: posting.costLabelError,
    priceMode: posting.priceMode,
    priceNumber: posting.priceNumber,
    priceNumberError: posting.priceNumberError,
    priceCurrency: posting.priceCurrency,
    priceCurrencyError: posting.priceCurrencyError,
  }));
}

export const emptyPosting = (): PostingRecordState =>
  normalizePostingState({});
