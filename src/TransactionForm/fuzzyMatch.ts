import { MatchedText } from "./PostingCandidateList";

export const fuzzyMatch = (
  value: string,
  keyword: string
): Array<MatchedText> | null => {
  const pieces: Array<MatchedText> = [];
  const chars = value.split("");
  let i = 0;
  let j = 0;
  let chunks = [];
  let matched = false;
  let firstMatch = false;
  for (; i < chars.length; ++i) {
    const char = chars.at(i);
    if (char?.toLowerCase() === keyword.substring(j, j + 1).toLowerCase()) {
      j += 1;
      if (chunks.length > 0 && !matched) {
        pieces.push({ text: chunks.join(""), matched });
        chunks = [];
      }
      matched = true;
      firstMatch = true;
    } else {
      if (chunks.length > 0 && matched) {
        pieces.push({ text: chunks.join(""), matched });
        chunks = [];
      }
      matched = false;
    }
    chunks.push(char);
  }
  if (!firstMatch) {
    return null;
  }
  if (chunks.length > 0) {
    pieces.push({ text: chunks.join(""), matched });
  }
  if (j < keyword.length) {
    return null;
  }
  return pieces;
};
