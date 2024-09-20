import { it, expect, describe } from "@jest/globals";
import { fuzzyMatch } from "../src/TransactionForm/fuzzyMatch";
import { MatchedText } from "../src/TransactionForm/PostingCandidateList";

describe.each([
  [
    "ABC",
    "abc",
    [
      {
        text: "ABC",
        matched: true,
      },
    ] as Array<MatchedText>,
  ],
  [
    "abc",
    "ABC",
    [
      {
        text: "abc",
        matched: true,
      },
    ] as Array<MatchedText>,
  ],
  [
    "aBcDeF",
    "ABcE",
    [
      {
        text: "aBc",
        matched: true,
      },
      {
        text: "D",
        matched: false,
      },
      {
        text: "e",
        matched: true,
      },
      {
        text: "F",
        matched: false,
      },
    ] as Array<MatchedText>,
  ],
  [
    "Assets:Bank",
    "ab",
    [
      {
        text: "A",
        matched: true,
      },
      {
        text: "ssets:",
        matched: false,
      },
      {
        text: "B",
        matched: true,
      },
      {
        text: "ank",
        matched: false,
      },
    ] as Array<MatchedText>,
  ],
  [
    "Assets:Bank",
    "a",
    [
      {
        text: "A",
        matched: true,
      },
      {
        text: "ssets:Bank",
        matched: false,
      },
    ] as Array<MatchedText>,
  ],
  ["Assets:Bank", "aaa", null],
])(".fuzzyMatch(%s, %s, %s)", (text, keyword, expected) => {
  it(`fuzzyMatch(${JSON.stringify(text)}, ${JSON.stringify(
    keyword
  )}, ${JSON.stringify(expected)})`, () => {
    expect(fuzzyMatch(text, keyword)).toEqual(expected);
  });
});
