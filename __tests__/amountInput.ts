import { it, expect, describe } from "@jest/globals";
import { isPlainAmountInput } from "../src/TransactionForm/amountInput";

describe("isPlainAmountInput", () => {
  it("allows empty and in-progress negative/decimal values", () => {
    expect(isPlainAmountInput("")).toBe(true);
    expect(isPlainAmountInput("-")).toBe(true);
    expect(isPlainAmountInput("+")).toBe(true);
    expect(isPlainAmountInput(".")).toBe(true);
    expect(isPlainAmountInput("-.")).toBe(true);
    expect(isPlainAmountInput("1.")).toBe(true);
  });

  it("allows plain amounts including -1 and thousands commas", () => {
    expect(isPlainAmountInput("-1")).toBe(true);
    expect(isPlainAmountInput("12.34")).toBe(true);
    expect(isPlainAmountInput("-1,234.50")).toBe(true);
    expect(isPlainAmountInput("+10")).toBe(true);
  });

  it("rejects letters and punctuation", () => {
    expect(isPlainAmountInput("ABC")).toBe(false);
    expect(isPlainAmountInput("def")).toBe(false);
    expect(isPlainAmountInput("!@#$")).toBe(false);
    expect(isPlainAmountInput("1a")).toBe(false);
    expect(isPlainAmountInput("1+2")).toBe(false);
    expect(isPlainAmountInput("1.2.3")).toBe(false);
  });
});
