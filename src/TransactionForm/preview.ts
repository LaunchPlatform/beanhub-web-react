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
      const currency = asString(values.currency).trim();
      return `${date} open ${account}${currency ? ` ${currency}` : ""}`.trim();
    }
    case "close":
      return `${date} close ${asString(values.account).trim()}`.trim();
    case "commodity":
      return `${date} commodity ${asString(values.symbol).trim()}`.trim();
    case "balance": {
      const tolerance = asString(values.tolerance).trim();
      if (tolerance) {
        return `${date} balance ${asString(values.account).trim()} ${asString(
          values.number
        ).trim()} ~ ${tolerance} ${asString(values.currency).trim()}`.trim();
      }
      return `${date} balance ${asString(values.account).trim()} ${asString(
        values.number
      ).trim()} ${asString(values.currency).trim()}`.trim();
    }
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
