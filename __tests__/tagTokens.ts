import { it, expect, describe } from "@jest/globals";
import {
  formatTokenLabel,
  isValidToken,
  joinTokenList,
  normalizeToken,
  parseTokenList,
  sanitizeTokenBody,
  sanitizeTokenInput,
  splitRawTokenInput,
} from "../src/Shared/tagTokens";

describe("normalizeToken", () => {
  it("strips repeated prefixes", () => {
    expect(normalizeToken("##trip", "#")).toBe("trip");
    expect(normalizeToken("^^invoice", "^")).toBe("invoice");
  });

  it("drops illegal characters", () => {
    expect(normalizeToken("trip!", "#")).toBe("trip");
    expect(normalizeToken("bad name", "#")).toBe("badname");
    expect(normalizeToken("@@@", "#")).toBe("");
  });
});

describe("isValidToken / sanitize", () => {
  it("accepts Beancount tag/link bodies", () => {
    expect(isValidToken("trip")).toBe(true);
    expect(isValidToken("invoice-42")).toBe(true);
    expect(isValidToken("a_b/c.d")).toBe(true);
    expect(isValidToken("bad name")).toBe(false);
    expect(isValidToken("tag!")).toBe(false);
  });

  it("sanitizes body and live input", () => {
    expect(sanitizeTokenBody("trip!")).toBe("trip");
    expect(sanitizeTokenInput("#trip!", "#")).toBe("trip");
    expect(sanitizeTokenInput("^a, ^b!", "^")).toBe("a, b");
    expect(sanitizeTokenInput("foo bar", "#")).toBe("foo bar");
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

  it("skips illegal tokens", () => {
    expect(parseTokenList("ok bad! also_ok", "#")).toEqual(["ok", "bad", "also_ok"]);
    expect(parseTokenList("!!!", "#")).toEqual([]);
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
