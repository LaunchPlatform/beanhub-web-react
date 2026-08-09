export type PreviewType =
  | "transaction"
  | "open"
  | "close"
  | "commodity"
  | "balance"
  | "note"
  | "event"
  | "auto";

export interface DiffSegment {
  readonly text: string;
  readonly changed: boolean;
}

export interface DiffLine {
  readonly type: "same" | "add" | "remove";
  readonly text: string;
  /** Character-level highlights for paired remove/add lines. */
  readonly segments?: Array<DiffSegment>;
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
      if (a[i - 1] === b[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1;
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
      }
    }
  }
  return table;
}

function pushSegment(
  segments: Array<{ text: string; changed: boolean }>,
  text: string,
  changed: boolean
) {
  if (!text) {
    return;
  }
  const last = segments[segments.length - 1];
  if (last && last.changed === changed) {
    last.text += text;
    return;
  }
  segments.push({ text, changed });
}

/**
 * Character-level LCS segments for a paired remove/add line.
 * Unchanged runs stay plain; changed runs are marked for stronger highlight.
 */
export function computeInlineSegments(
  original: string,
  updated: string
): { original: Array<DiffSegment>; updated: Array<DiffSegment> } {
  const a = Array.from(original);
  const b = Array.from(updated);
  if (a.length === 0 && b.length === 0) {
    return { original: [], updated: [] };
  }
  const table = lcsTable(a, b);
  const originalSegs: Array<{ text: string; changed: boolean }> = [];
  const updatedSegs: Array<{ text: string; changed: boolean }> = [];
  let i = a.length;
  let j = b.length;
  const originalStack: Array<{ text: string; changed: boolean }> = [];
  const updatedStack: Array<{ text: string; changed: boolean }> = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      originalStack.push({ text: a[i - 1], changed: false });
      updatedStack.push({ text: b[j - 1], changed: false });
      i -= 1;
      j -= 1;
    } else if (
      j > 0 &&
      (i === 0 || table[i][j - 1] > table[i - 1][j])
    ) {
      // Prefer deleting on ties so repeated chars (e.g. 6.33 vs 6.34) keep
      // the shared suffix aligned instead of swallowing the wrong digit.
      updatedStack.push({ text: b[j - 1], changed: true });
      j -= 1;
    } else if (i > 0) {
      originalStack.push({ text: a[i - 1], changed: true });
      i -= 1;
    }
  }

  while (originalStack.length) {
    const part = originalStack.pop()!;
    pushSegment(originalSegs, part.text, part.changed);
  }
  while (updatedStack.length) {
    const part = updatedStack.pop()!;
    pushSegment(updatedSegs, part.text, part.changed);
  }

  return { original: originalSegs, updated: updatedSegs };
}

function annotateInlineHighlights(lines: Array<DiffLine>): Array<DiffLine> {
  const result: Array<DiffLine> = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (line.type !== "remove") {
      result.push(line);
      index += 1;
      continue;
    }

    let removeEnd = index;
    while (removeEnd < lines.length && lines[removeEnd].type === "remove") {
      removeEnd += 1;
    }
    let addEnd = removeEnd;
    while (addEnd < lines.length && lines[addEnd].type === "add") {
      addEnd += 1;
    }

    const removes = lines.slice(index, removeEnd);
    const adds = lines.slice(removeEnd, addEnd);
    const pairCount = Math.min(removes.length, adds.length);
    const paired: Array<{
      original: Array<DiffSegment>;
      updated: Array<DiffSegment>;
    }> = [];
    for (let p = 0; p < pairCount; p += 1) {
      paired.push(computeInlineSegments(removes[p].text, adds[p].text));
    }

    for (let p = 0; p < removes.length; p += 1) {
      if (p < pairCount) {
        result.push({
          type: "remove",
          text: removes[p].text,
          segments: paired[p].original,
        });
      } else {
        result.push(removes[p]);
      }
    }
    for (let p = 0; p < adds.length; p += 1) {
      if (p < pairCount) {
        result.push({
          type: "add",
          text: adds[p].text,
          segments: paired[p].updated,
        });
      } else {
        result.push(adds[p]);
      }
    }
    index = addEnd;
  }
  return result;
}

function lineLcsTable(
  a: Array<string>,
  b: Array<string>
): Array<Array<number>> {
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
  const table = lineLcsTable(a, b);
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
  return annotateInlineHighlights(lines);
}
