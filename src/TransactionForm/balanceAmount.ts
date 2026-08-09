export interface AmountPosting {
  readonly unitNumber?: string;
  readonly unitCurrency?: string;
}

export interface BalancingAmount {
  readonly number: string;
  readonly currency: string;
}

function stripCommas(raw: string): string {
  return raw.replace(/,/g, "").trim();
}

function isPlainNumber(raw: string): boolean {
  return /^[+-]?\d+(?:\.\d+)?$/.test(raw);
}

function decimalScale(raw: string): number {
  const match = stripCommas(raw).match(/\.(\d+)/);
  return match ? match[1].length : 0;
}

function toScaledInt(raw: string, scale: number): bigint {
  const cleaned = stripCommas(raw);
  const negative = cleaned.startsWith("-");
  const unsigned = cleaned.replace(/^[+-]/, "");
  const [intPart, frac = ""] = unsigned.split(".");
  const paddedFrac = (frac + "0".repeat(scale)).slice(0, scale);
  const digits = BigInt(`${intPart}${paddedFrac}` || "0");
  return negative ? -digits : digits;
}

function fromScaledInt(value: bigint, scale: number): string {
  const negative = value < BigInt(0);
  let digits = (negative ? -value : value).toString();
  if (scale === 0) {
    return `${negative ? "-" : ""}${digits}`;
  }
  digits = digits.padStart(scale + 1, "0");
  const intPart = digits.slice(0, -scale) || "0";
  const frac = digits.slice(-scale);
  return `${negative ? "-" : ""}${intPart}.${frac}`;
}

/**
 * Compute the unit amount that would balance `postings[targetIndex]` against
 * other same-currency postings. Returns null when remaining cannot be inferred
 * (no filled peers, mixed currencies, unparseable numbers, or currency mismatch).
 */
export function computeBalancingAmount(
  postings: ReadonlyArray<AmountPosting>,
  targetIndex: number
): BalancingAmount | null {
  if (targetIndex < 0 || targetIndex >= postings.length) {
    return null;
  }
  const targetCurrency = (postings[targetIndex].unitCurrency ?? "").trim();
  const peers: Array<{ raw: string; currency: string }> = [];
  for (let i = 0; i < postings.length; i++) {
    if (i === targetIndex) {
      continue;
    }
    const raw = stripCommas(postings[i].unitNumber ?? "");
    const currency = (postings[i].unitCurrency ?? "").trim();
    if (!raw || !currency) {
      continue;
    }
    if (!isPlainNumber(raw)) {
      return null;
    }
    peers.push({ raw, currency });
  }
  if (peers.length === 0) {
    return null;
  }
  const currencies = new Set(peers.map((peer) => peer.currency));
  if (currencies.size !== 1) {
    return null;
  }
  const currency = peers[0].currency;
  if (targetCurrency && targetCurrency !== currency) {
    return null;
  }
  const scale = Math.max(...peers.map((peer) => decimalScale(peer.raw)));
  let sum = BigInt(0);
  for (const peer of peers) {
    sum += toScaledInt(peer.raw, scale);
  }
  return {
    number: fromScaledInt(-sum, scale),
    currency,
  };
}
