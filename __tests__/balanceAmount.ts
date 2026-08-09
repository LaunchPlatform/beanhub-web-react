import { it, expect, describe } from "@jest/globals";
import { computeBalancingAmount } from "../src/TransactionForm/balanceAmount";

describe("computeBalancingAmount", () => {
  it("negates a single peer amount", () => {
    expect(
      computeBalancingAmount(
        [
          { unitNumber: "12.34", unitCurrency: "USD" },
          { unitNumber: "", unitCurrency: "" },
        ],
        1
      )
    ).toEqual({ number: "-12.34", currency: "USD" });
  });

  it("sums multiple peers in the same currency", () => {
    expect(
      computeBalancingAmount(
        [
          { unitNumber: "10.00", unitCurrency: "USD" },
          { unitNumber: "2.50", unitCurrency: "USD" },
          { unitNumber: "", unitCurrency: "USD" },
        ],
        2
      )
    ).toEqual({ number: "-12.50", currency: "USD" });
  });

  it("ignores empty peer rows", () => {
    expect(
      computeBalancingAmount(
        [
          { unitNumber: "5", unitCurrency: "USD" },
          { unitNumber: "", unitCurrency: "" },
          { unitNumber: "", unitCurrency: "" },
        ],
        2
      )
    ).toEqual({ number: "-5", currency: "USD" });
  });

  it("returns null for mixed currencies", () => {
    expect(
      computeBalancingAmount(
        [
          { unitNumber: "10", unitCurrency: "USD" },
          { unitNumber: "1", unitCurrency: "EUR" },
          { unitNumber: "", unitCurrency: "" },
        ],
        2
      )
    ).toBeNull();
  });

  it("returns null when target currency conflicts", () => {
    expect(
      computeBalancingAmount(
        [
          { unitNumber: "10", unitCurrency: "USD" },
          { unitNumber: "", unitCurrency: "EUR" },
        ],
        1
      )
    ).toBeNull();
  });

  it("returns null when there are no peer amounts", () => {
    expect(
      computeBalancingAmount(
        [
          { unitNumber: "", unitCurrency: "" },
          { unitNumber: "", unitCurrency: "" },
        ],
        0
      )
    ).toBeNull();
  });

  it("handles commas and leading plus", () => {
    expect(
      computeBalancingAmount(
        [
          { unitNumber: "+1,234.50", unitCurrency: "USD" },
          { unitNumber: "", unitCurrency: "USD" },
        ],
        1
      )
    ).toEqual({ number: "-1234.50", currency: "USD" });
  });
});
