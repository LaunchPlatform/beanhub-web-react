import { CostMode, PriceMode } from "./PostingInput";
import { PostingRecord } from "./PostingListContainer";

export type FormMode = "simple" | "advanced";

export interface AdvancedModeHints {
  readonly initialMode?: FormMode;
  readonly initialFlag?: string;
  readonly flagError?: string;
  readonly initialTags?: string;
  readonly tagsError?: string;
  readonly initialLinks?: string;
  readonly linksError?: string;
  readonly initialPostings?: Array<PostingRecord>;
}

function hasText(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  return String(value).trim().length > 0;
}

function hasError(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  if (Array.isArray(value)) {
    return value.some(Boolean);
  }
  return String(value).trim().length > 0;
}

export function shouldUseAdvancedMode(hints: AdvancedModeHints): boolean {
  if (hints.initialMode === "advanced") {
    return true;
  }
  if (hints.initialMode === "simple") {
    return false;
  }
  if (hints.flagError || hints.tagsError || hints.linksError) {
    return true;
  }
  // Every Beancount txn has a flag; only non-default flags need advanced UI.
  const flag = (hints.initialFlag ?? "").trim();
  if (flag.length > 0 && flag !== "*") {
    return true;
  }
  if ((hints.initialTags ?? "").trim().length > 0) {
    return true;
  }
  if ((hints.initialLinks ?? "").trim().length > 0) {
    return true;
  }
  for (const posting of hints.initialPostings ?? []) {
    if (hasText(posting.flag)) {
      return true;
    }
    // Backend may send costMode/priceMode as null for simple postings; only
    // active modes (or filled cost/price fields) should force advanced.
    if (isActiveCostMode(posting.costMode)) {
      return true;
    }
    if (isActivePriceMode(posting.priceMode)) {
      return true;
    }
    if (
      hasText(posting.costNumber) ||
      hasText(posting.costCurrency) ||
      hasText(posting.costDate) ||
      hasText(posting.costLabel) ||
      hasText(posting.priceNumber) ||
      hasText(posting.priceCurrency) ||
      hasError(posting.costNumberError) ||
      hasError(posting.costCurrencyError) ||
      hasError(posting.costDateError) ||
      hasError(posting.costLabelError) ||
      hasError(posting.priceNumberError) ||
      hasError(posting.priceCurrencyError) ||
      hasError(posting.flagError)
    ) {
      return true;
    }
  }
  return false;
}

export function isActiveCostMode(mode?: CostMode | null): boolean {
  return mode === CostMode.COST || mode === CostMode.TOTAL_COST;
}

export function isActivePriceMode(mode?: PriceMode | null): boolean {
  return mode === PriceMode.PRICE || mode === PriceMode.TOTAL_PRICE;
}
