import { it, expect, describe } from "@jest/globals";
import {
  formatTokenLabel,
  joinTokenList,
  normalizeToken,
  parseTokenList,
  splitRawTokenInput,
} from "../src/Shared/tagTokens";

describe("normalizeToken", () => {
  it("strips repeated prefixes", () => {
    expect(normalizeToken("##trip", "#")).toBe("trip");
    expect(normalizeToken("^^invoice", "^")).toBe("invoice");
  });
});

describe("formatTokenLabel", () => {
  it("adds Beancount markers for chips", () => {
    expect(formatTokenLabel("trip", "#")).toBe("#trip");
    expect(formatTokenLabel("invoice", "^")).toBe("^invoice");
    expect(formatTokenLabel("trip")).toBe("trip");
  });
});

describe("parseTokenList", () => {
  it("splits on spaces and commas and de-dupes", () => {
    expect(parseTokenList("trip, vacation trip #food", "#")).toEqual([
      "trip",
      "vacation",
      "food",
    ]);
  });

  it("returns empty for blank", () => {
    expect(parseTokenList("  ")).toEqual([]);
    expect(parseTokenList(undefined)).toEqual([]);
  });
});

describe("joinTokenList", () => {
  it("joins with spaces for form submission", () => {
    expect(joinTokenList(["trip", "vacation"])).toBe("trip vacation");
  });
});

describe("splitRawTokenInput", () => {
  it("parses pasted multi values", () => {
    expect(splitRawTokenInput("a, b  c", undefined)).toEqual(["a", "b", "c"]);
  });
});
