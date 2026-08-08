import { CostMode, PriceMode } from "./PostingInput";
import { PostingRecord } from "./PostingListContainer";
import { MetaRecord } from "./MetaListContainer";
import { isActiveCostMode, isActivePriceMode } from "./formMode";

export interface TransactionPreviewInput {
  readonly date?: string;
  readonly flag?: string;
  readonly payee?: string;
  readonly narration?: string;
  readonly tags?: string;
  readonly links?: string;
  readonly postings?: Array<PostingRecord>;
  readonly metadata?: Array<MetaRecord>;
}

function quoteBeancountString(value: string): string {
  return JSON.stringify(value);
}

function formatSpaceSeparated(
  value: string | undefined,
  prefix: string
): string {
  if (!value) {
    return "";
  }
  return value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => {
      const stripped = part.startsWith(prefix) ? part.slice(prefix.length) : part;
      return stripped.length > 0 ? ` ${prefix}${stripped}` : "";
    })
    .join("");
}

export function formatPostingCost(posting: PostingRecord): string {
  if (!isActiveCostMode(posting.costMode)) {
    return "";
  }
  const number = (posting.costNumber ?? "").trim();
  const currency = (posting.costCurrency ?? "").trim();
  if (!number || !currency) {
    return "";
  }
  const parts = [`${number} ${currency}`];
  const costDate = (posting.costDate ?? "").trim();
  if (costDate) {
    parts.push(costDate);
  }
  const costLabel = (posting.costLabel ?? "").trim();
  if (costLabel) {
    parts.push(quoteBeancountString(costLabel));
  }
  const body = parts.join(", ");
  if (posting.costMode === CostMode.TOTAL_COST) {
    return `{{${body}}}`;
  }
  return `{${body}}`;
}

export function formatPostingLine(posting: PostingRecord): string {
  const parts: Array<string> = [];
  const flag = (posting.flag ?? "").trim();
  if (flag) {
    parts.push(flag);
  }
  const account = (posting.account ?? "").trim();
  if (account) {
    parts.push(account);
  }
  const number = (posting.unitNumber ?? "").trim();
  const currency = (posting.unitCurrency ?? "").trim();
  const hasAmount = number.length > 0 && currency.length > 0;
  if (hasAmount) {
    parts.push(`${number} ${currency}`);
    const cost = formatPostingCost(posting);
    if (cost) {
      parts.push(cost);
    }
    if (isActivePriceMode(posting.priceMode)) {
      const priceNumber = (posting.priceNumber ?? "").trim();
      const priceCurrency = (posting.priceCurrency ?? "").trim();
      if (priceNumber && priceCurrency) {
        const op = posting.priceMode === PriceMode.TOTAL_PRICE ? "@@" : "@";
        parts.push(`${op} ${priceNumber} ${priceCurrency}`);
      }
    }
  }
  return parts.join(" ");
}

export function formatTransactionBeancount(
  input: TransactionPreviewInput
): string {
  const date = (input.date ?? "").trim() || "YYYY-MM-DD";
  const flag = (input.flag ?? "").trim() || "*";
  const payee = (input.payee ?? "").trim();
  const narration = (input.narration ?? "").trim();
  let header = `${date} ${flag}`;
  if (payee) {
    header += ` ${quoteBeancountString(payee)}`;
  }
  header += ` ${quoteBeancountString(narration)}`;
  header += formatSpaceSeparated(input.tags, "#");
  header += formatSpaceSeparated(input.links, "^");

  const lines = [header];
  for (const meta of input.metadata ?? []) {
    const key = (meta.metaKey ?? "").trim();
    const value = (meta.metaValue ?? "").trim();
    if (!key && !value) {
      continue;
    }
    if (!key) {
      continue;
    }
    lines.push(`  ${key}: ${quoteBeancountString(value)}`);
  }
  for (const posting of input.postings ?? []) {
    const line = formatPostingLine(posting);
    if (!line.trim()) {
      continue;
    }
    lines.push(`  ${line}`);
  }
  return lines.join("\n");
}
