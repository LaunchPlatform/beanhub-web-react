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

function lcsTable(a: Array<string>, b: Array<string>): Array<Array<number>> {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table: Array<Array<number>> = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      if (a[i - 1] === b[j - 1]) {
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
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      stack.push({ type: "same", text: a[i - 1] });
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
