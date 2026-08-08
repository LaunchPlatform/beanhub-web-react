/** Beancount tag/link body — matches beanhub lexer `_tag_or_link`. */
export const TOKEN_BODY_PATTERN = /^[A-Za-z0-9\-_/.]+$/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isValidToken(token: string): boolean {
  return TOKEN_BODY_PATTERN.test(token);
}

/** Keep only characters allowed in a Beancount tag/link body. */
export function sanitizeTokenBody(value: string): string {
  return value.replace(/[^A-Za-z0-9\-_/.]/g, "");
}

/**
 * Normalize live input: strip leading markers, drop illegal characters,
 * but keep spaces/commas so multi-token paste still works.
 */
export function sanitizeTokenInput(
  value: string,
  stripPrefix?: string
): string {
  let cleaned = value;
  if (stripPrefix) {
    const prefix = escapeRegExp(stripPrefix);
    cleaned = cleaned.replace(new RegExp(`(^|[\\s,]+)${prefix}+`, "g"), "$1");
    cleaned = cleaned.replace(new RegExp(`^\\s*${prefix}+`), "");
  }
  return cleaned.replace(/[^A-Za-z0-9\-_/\s,.]/g, "");
}

export function normalizeToken(value: string, stripPrefix?: string): string {
  let token = value.trim();
  if (!token) {
    return "";
  }
  if (stripPrefix) {
    while (token.startsWith(stripPrefix)) {
      token = token.slice(stripPrefix.length).trim();
    }
  }
  token = sanitizeTokenBody(token);
  return isValidToken(token) ? token : "";
}

/** Chip / create-label text with Beancount marker; bare token for the input field. */
export function formatTokenLabel(token: string, stripPrefix?: string): string {
  if (!token) {
    return "";
  }
  return stripPrefix ? `${stripPrefix}${token}` : token;
}

export function parseTokenList(
  value?: string,
  stripPrefix?: string
): Array<string> {
  if (!value) {
    return [];
  }
  const seen = new Set<string>();
  const tokens: Array<string> = [];
  for (const part of value.split(/[\s,]+/)) {
    const token = normalizeToken(part, stripPrefix);
    if (!token || seen.has(token)) {
      continue;
    }
    seen.add(token);
    tokens.push(token);
  }
  return tokens;
}

export function joinTokenList(tokens: Array<string>): string {
  return tokens.join(" ");
}

export function splitRawTokenInput(
  value: string,
  stripPrefix?: string
): Array<string> {
  return parseTokenList(value, stripPrefix);
}
