import { CostMode, PriceMode } from "./PostingInput";
import { PostingRecord } from "./PostingListContainer";
import { MetaRecord } from "./MetaListContainer";
import { isActiveCostMode, isActivePriceMode } from "./formMode";
import { PreviewType } from "../Shared/diff";

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

export interface ColumnWidths {
  readonly accountWidth: number;
  readonly numberWidth: number;
}

/** Mirrors beancount-black defaults. */
export const DEFAULT_INDENT_WIDTH = 2;
export const DEFAULT_ACCOUNT_WIDTH = 30;
export const DEFAULT_NUMBER_WIDTH = 12;
/** Length of `"YYYY-MM-DD balance "` so posting amounts align with balance amounts. */
export const BALANCE_PREFIX_WIDTH = 19;

export function formatNumber(raw: string): string {
  const cleaned = raw.replace(/,/g, "").trim();
  if (!cleaned) {
    return raw;
  }
  // Leave arithmetic expressions and other non-plain numbers untouched.
  const match = cleaned.match(/^([+-]?)(\d+)(?:\.(\d+))?$/);
  if (!match) {
    return raw.trim();
  }
  const [, sign, intPart, frac] = match;
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (frac !== undefined) {
    return `${sign}${withCommas}.${frac}`;
  }
  return `${sign}${withCommas}`;
}

function quoteBeancountString(value: string): string {
  return JSON.stringify(value);
}

function parseAnnotationTokens(
  value: string | undefined,
  prefix: string
): Array<string> {
  if (!value) {
    return [];
  }
  return value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => {
      const stripped = part.startsWith(prefix) ? part.slice(prefix.length) : part;
      return stripped.length > 0 ? `${prefix}${stripped}` : "";
    })
    .filter((part) => part.length > 0);
}

/** Links then tags, each sorted — matches beancount-black. */
function formatAnnotations(tags?: string, links?: string): string {
  const linkTokens = parseAnnotationTokens(links, "^").sort();
  const tagTokens = parseAnnotationTokens(tags, "#").sort();
  const all = [...linkTokens, ...tagTokens];
  return all.length > 0 ? ` ${all.join(" ")}` : "";
}

export function calculateColumnWidths(
  postings: Array<PostingRecord> = [],
  balance?: { account?: string; number?: string }
): ColumnWidths {
  let accountWidth = DEFAULT_ACCOUNT_WIDTH;
  let numberWidth = DEFAULT_NUMBER_WIDTH;

  for (const posting of postings) {
    const account = (posting.account ?? "").trim();
    if (account.length > accountWidth) {
      accountWidth = account.length;
    }
    const number = (posting.unitNumber ?? "").trim();
    const currency = (posting.unitCurrency ?? "").trim();
    if (number && currency) {
      const formatted = formatNumber(number);
      if (formatted.length > numberWidth) {
        numberWidth = formatted.length;
      }
    }
  }

  if (balance) {
    const account = (balance.account ?? "").trim();
    if (account.length > accountWidth) {
      accountWidth = account.length;
    }
    const number = (balance.number ?? "").trim();
    if (number) {
      const formatted = formatNumber(number);
      if (formatted.length > numberWidth) {
        numberWidth = formatted.length;
      }
    }
  }

  return { accountWidth, numberWidth };
}

function padEnd(value: string, width: number): string {
  if (value.length >= width) {
    return value;
  }
  return value + " ".repeat(width - value.length);
}

function padStart(value: string, width: number): string {
  if (value.length >= width) {
    return value;
  }
  return " ".repeat(width - value.length) + value;
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
  const parts = [`${formatNumber(number)} ${currency}`];
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

export function formatPostingLine(
  posting: PostingRecord,
  widths: ColumnWidths = {
    accountWidth: DEFAULT_ACCOUNT_WIDTH,
    numberWidth: DEFAULT_NUMBER_WIDTH,
  }
): string {
  const items: Array<string> = [];
  const flag = (posting.flag ?? "").trim();
  if (flag) {
    items.push(flag);
  }
  const account = (posting.account ?? "").trim();
  const number = (posting.unitNumber ?? "").trim();
  const currency = (posting.unitCurrency ?? "").trim();
  const hasAmount = number.length > 0 && currency.length > 0;

  if (!account && !hasAmount) {
    return "";
  }

  // Short posting (no amount): account only, no padding — matches beancount-black.
  if (!hasAmount) {
    if (account) {
      items.push(account);
    }
    return items.join(" ");
  }

  const accountFieldWidth =
    widths.accountWidth + (BALANCE_PREFIX_WIDTH - DEFAULT_INDENT_WIDTH);
  items.push(padEnd(account, accountFieldWidth));
  items.push(padStart(formatNumber(number), widths.numberWidth));
  items.push(currency);

  const cost = formatPostingCost(posting);
  if (cost) {
    items.push(cost);
  }
  if (isActivePriceMode(posting.priceMode)) {
    const priceNumber = (posting.priceNumber ?? "").trim();
    const priceCurrency = (posting.priceCurrency ?? "").trim();
    if (priceNumber && priceCurrency) {
      const op = posting.priceMode === PriceMode.TOTAL_PRICE ? "@@" : "@";
      items.push(`${op} ${formatNumber(priceNumber)} ${priceCurrency}`);
    }
  }
  return items.join(" ");
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
  header += formatAnnotations(input.tags, input.links);

  const postings = input.postings ?? [];
  const widths = calculateColumnWidths(postings);
  const indent = " ".repeat(DEFAULT_INDENT_WIDTH);

  const lines = [header];
  for (const meta of input.metadata ?? []) {
    const key = (meta.metaKey ?? "").trim();
    const value = (meta.metaValue ?? "").trim();
    if (!key) {
      continue;
    }
    lines.push(`${indent}${key}: ${quoteBeancountString(value)}`);
  }
  for (const posting of postings) {
    const line = formatPostingLine(posting, widths);
    if (!line.trim()) {
      continue;
    }
    lines.push(`${indent}${line}`);
  }
  return lines.join("\n");
}

function asString(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.join(",");
  }
  return String(value);
}

export function detectPreviewType(
  values: Record<string, unknown>
): Exclude<PreviewType, "auto"> {
  if (values.postings !== undefined) {
    return "transaction";
  }
  if (values.symbol !== undefined) {
    return "commodity";
  }
  if (values.comment !== undefined) {
    return "note";
  }
  if (values.type !== undefined && values.description !== undefined) {
    return "event";
  }
  if (values.number !== undefined && values.currency !== undefined) {
    return "balance";
  }
  if (values.account !== undefined && values.currency !== undefined) {
    return "open";
  }
  if (values.account !== undefined) {
    return "close";
  }
  return "transaction";
}

function formatBalanceBeancount(values: Record<string, unknown>): string {
  const date = asString(values.date).trim() || "YYYY-MM-DD";
  const account = asString(values.account).trim();
  const number = asString(values.number).trim();
  const currency = asString(values.currency).trim();
  const tolerance = asString(values.tolerance).trim();
  const widths = calculateColumnWidths([], { account, number });

  const accountCol = padEnd(account, widths.accountWidth);
  if (tolerance) {
    // Tolerance keeps number ~ tol as one logical amount; pad the first number only.
    const numberCol = padStart(formatNumber(number), widths.numberWidth);
    return `${date} balance ${accountCol} ${numberCol} ~ ${formatNumber(
      tolerance
    )} ${currency}`.trim();
  }
  const numberCol = padStart(formatNumber(number), widths.numberWidth);
  return `${date} balance ${accountCol} ${numberCol} ${currency}`.trim();
}

export function formatEntryBeancount(
  previewType: PreviewType,
  values: Record<string, unknown>
): string {
  const kind =
    previewType === "auto" ? detectPreviewType(values) : previewType;
  const date = asString(values.date).trim() || "YYYY-MM-DD";
  switch (kind) {
    case "transaction":
      return formatTransactionBeancount({
        date: asString(values.date),
        flag: asString(values.flag),
        payee: asString(values.payee),
        narration: asString(values.narration),
        tags: asString(values.tags),
        links: asString(values.links),
        postings: (values.postings as Array<PostingRecord>) ?? [],
        metadata: (values.metadata as Array<MetaRecord>) ?? [],
      });
    case "open": {
      const account = asString(values.account).trim();
      const currency = asString(values.currency).trim().replace(/\s+/g, "");
      return `${date} open ${account}${currency ? ` ${currency}` : ""}`.trim();
    }
    case "close":
      return `${date} close ${asString(values.account).trim()}`.trim();
    case "commodity":
      return `${date} commodity ${asString(values.symbol).trim()}`.trim();
    case "balance":
      return formatBalanceBeancount(values);
    case "note":
      return `${date} note ${asString(values.account).trim()} ${quoteBeancountString(
        asString(values.comment)
      )}`;
    case "event":
      return `${date} event ${quoteBeancountString(
        asString(values.type)
      )} ${quoteBeancountString(asString(values.description))}`;
    default:
      return "";
  }
}
