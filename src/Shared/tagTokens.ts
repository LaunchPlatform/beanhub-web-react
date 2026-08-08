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
  return token;
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
