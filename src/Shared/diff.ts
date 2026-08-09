export type PreviewType =
  | "transaction"
  | "open"
  | "close"
  | "commodity"
  | "balance"
  | "note"
  | "event"
  | "auto";

export interface DiffLine {
  readonly type: "same" | "add" | "remove";
  readonly text: string;
}

/**
 * Normalize a Beancount source line for semantic comparison.
 *
 * Collapses runs of whitespace outside of double-quoted strings so that
 * column-alignment / indent differences do not count as changes. Spaces
 * inside quoted strings (payee, narration, metadata values, cost labels)
 * are preserved.
 */
export function normalizeBeancountLine(line: string): string {
  let result = "";
  let inString = false;
  let pendingSpace = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (inString) {
      result += ch;
      if (ch === "\\") {
        i += 1;
        if (i < line.length) {
          result += line[i];
        }
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      if (pendingSpace && result.length > 0) {
        result += " ";
      }
      pendingSpace = false;
      inString = true;
      result += ch;
      continue;
    }

    if (ch === " " || ch === "\t") {
      pendingSpace = true;
      continue;
    }

    if (pendingSpace && result.length > 0) {
      result += " ";
    }
    pendingSpace = false;
    result += ch;
  }

  return result;
}

export function beancountLinesEqual(a: string, b: string): boolean {
  return normalizeBeancountLine(a) === normalizeBeancountLine(b);
}

function lcsTable(a: Array<string>, b: Array<string>): Array<Array<number>> {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table: Array<Array<number>> = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      if (beancountLinesEqual(a[i - 1], b[j - 1])) {
        table[i][j] = table[i - 1][j - 1] + 1;
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
      }
    }
  }
  return table;
}

export function computeLineDiff(
  original: string,
  updated: string
): Array<DiffLine> {
  const a = original.replace(/\n$/, "").split("\n");
  const b = updated.replace(/\n$/, "").split("\n");
  if (a.length === 1 && a[0] === "" && b.length === 1 && b[0] === "") {
    return [];
  }
  const table = lcsTable(a, b);
  const lines: Array<DiffLine> = [];
  let i = a.length;
  let j = b.length;
  const stack: Array<DiffLine> = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && beancountLinesEqual(a[i - 1], b[j - 1])) {
      // Prefer the updated formatting for "same" lines so the preview stays
      // visually consistent with the form serializer.
      stack.push({ type: "same", text: b[j - 1] });
      i -= 1;
      j -= 1;
    } else if (j > 0 && (i === 0 || table[i][j - 1] >= table[i - 1][j])) {
      stack.push({ type: "add", text: b[j - 1] });
      j -= 1;
    } else if (i > 0) {
      stack.push({ type: "remove", text: a[i - 1] });
      i -= 1;
    }
  }
  while (stack.length) {
    lines.push(stack.pop() as DiffLine);
  }
  return lines;
}
