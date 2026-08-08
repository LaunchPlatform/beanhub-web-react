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
  if (hints.initialFlag !== undefined && hints.initialFlag !== "*") {
    return true;
  }
  if ((hints.initialTags ?? "").trim().length > 0) {
    return true;
  }
  if ((hints.initialLinks ?? "").trim().length > 0) {
    return true;
  }
  for (const posting of hints.initialPostings ?? []) {
    if ((posting.flag ?? "").trim().length > 0) {
      return true;
    }
    if (
      posting.costMode !== undefined &&
      posting.costMode !== CostMode.INACTIVE &&
      posting.costMode !== CostMode.EXPANDED
    ) {
      return true;
    }
    if (
      (posting.costNumber ?? "").trim().length > 0 ||
      (posting.costCurrency ?? "").trim().length > 0 ||
      (posting.costDate ?? "").trim().length > 0 ||
      (posting.costLabel ?? "").trim().length > 0 ||
      posting.costNumberError !== undefined ||
      posting.costCurrencyError !== undefined ||
      posting.costDateError !== undefined ||
      posting.costLabelError !== undefined ||
      posting.flagError !== undefined
    ) {
      return true;
    }
  }
  return false;
}

export function isActiveCostMode(mode?: CostMode): boolean {
  return mode === CostMode.COST || mode === CostMode.TOTAL_COST;
}

export function isActivePriceMode(mode?: PriceMode): boolean {
  return mode === PriceMode.PRICE || mode === PriceMode.TOTAL_PRICE;
}
