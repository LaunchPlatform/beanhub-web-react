// ref: https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Longest_common_substring#TypeScript
export function longestCommonSubstr(lhs: string, rhs: string) {
  if (!lhs || !rhs) {
    return "";
  }

  const str1Length = lhs.length;
  const str2Length = rhs.length;
  let maxLength = 0;
  let beginIndx = 0; // relative to str1
  const num = [
    new Array(str2Length),
    ([] as number[]).fill(0, 0, -str2Length),
  ] as [number[], number[]];
  for (let i = 0; i < str1Length; ++i) {
    const lastRow = 1 - (i % 2);
    const currentRow = num[1 - lastRow];
    for (let j = 0; j < str2Length; ++j) {
      if (lhs[i] !== rhs[j]) {
        currentRow[j] = 0;
      } else {
        if (i === 0 || j === 0) {
          currentRow[j] = 1;
        } else {
          currentRow[j] = 1 + num[lastRow][j - 1];
        }

        if (currentRow[j] > maxLength) {
          maxLength = currentRow[j];
          beginIndx = i - currentRow[j] + 1;
          // if the current LCS is the same as the last time this block ran
        }
      }
    }
  }
  return lhs.slice(beginIndx, maxLength + beginIndx);
}
