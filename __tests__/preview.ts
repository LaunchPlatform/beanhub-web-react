import { it, expect, describe } from "@jest/globals";
import {
  formatPostingCost,
  formatPostingLine,
  formatTransactionBeancount,
} from "../src/TransactionForm/preview";
import { CostMode, PriceMode } from "../src/TransactionForm/PostingInput";
import { shouldUseAdvancedMode } from "../src/TransactionForm/formMode";

describe("formatPostingCost", () => {
  it("returns empty when cost inactive", () => {
    expect(formatPostingCost({ costMode: CostMode.INACTIVE })).toBe("");
  });

  it("formats unit cost with date and label", () => {
    expect(
      formatPostingCost({
        costMode: CostMode.COST,
        costNumber: "123.45",
        costCurrency: "USD",
        costDate: "2022-01-15",
        costLabel: "lot-a",
      })
    ).toBe('{123.45 USD, 2022-01-15, "lot-a"}');
  });

  it("formats total cost", () => {
    expect(
      formatPostingCost({
        costMode: CostMode.TOTAL_COST,
        costNumber: "1000",
        costCurrency: "USD",
      })
    ).toBe("{{1000 USD}}");
  });
});

describe("formatPostingLine", () => {
  it("formats flag account amount cost and price", () => {
    expect(
      formatPostingLine({
        flag: "!",
        account: "Assets:Investments",
        unitNumber: "10",
        unitCurrency: "HOOL",
        costMode: CostMode.COST,
        costNumber: "12",
        costCurrency: "USD",
        priceMode: PriceMode.PRICE,
        priceNumber: "1.5",
        priceCurrency: "EUR",
      })
    ).toBe("! Assets:Investments 10 HOOL {12 USD} @ 1.5 EUR");
  });
});

describe("formatTransactionBeancount", () => {
  it("formats a full transaction", () => {
    expect(
      formatTransactionBeancount({
        date: "2022-03-02",
        flag: "*",
        payee: "Broker",
        narration: "Buy shares",
        tags: "trip vacation",
        links: "invoice-42",
        metadata: [{ metaKey: "import-id", metaValue: "abc" }],
        postings: [
          {
            account: "Assets:Investments",
            unitNumber: "10",
            unitCurrency: "HOOL",
            costMode: CostMode.COST,
            costNumber: "123.45",
            costCurrency: "USD",
            costDate: "2022-01-15",
            costLabel: "lot-a",
          },
          {
            account: "Assets:Cash",
            unitNumber: "-1234.50",
            unitCurrency: "USD",
          },
        ],
      })
    ).toBe(
      [
        '2022-03-02 * "Broker" "Buy shares" #trip #vacation ^invoice-42',
        '  import-id: "abc"',
        '  Assets:Investments 10 HOOL {123.45 USD, 2022-01-15, "lot-a"}',
        "  Assets:Cash -1234.50 USD",
      ].join("\n")
    );
  });
});

describe("shouldUseAdvancedMode", () => {
  it("defaults to simple", () => {
    expect(shouldUseAdvancedMode({})).toBe(false);
  });

  it("turns on for tags and non-default flag", () => {
    expect(shouldUseAdvancedMode({ initialTags: "food" })).toBe(true);
    expect(shouldUseAdvancedMode({ initialFlag: "!" })).toBe(true);
  });

  it("turns on for posting costs", () => {
    expect(
      shouldUseAdvancedMode({
        initialPostings: [{ costMode: CostMode.COST, costNumber: "1" }],
      })
    ).toBe(true);
  });

  it("respects explicit initialMode", () => {
    expect(
      shouldUseAdvancedMode({ initialMode: "simple", initialTags: "x" })
    ).toBe(false);
    expect(shouldUseAdvancedMode({ initialMode: "advanced" })).toBe(true);
  });
});

import { computeLineDiff } from "../src/Shared/diff";
import { formatEntryBeancount } from "../src/TransactionForm/preview";

describe("computeLineDiff", () => {
  it("marks changed lines", () => {
    expect(
      computeLineDiff("a\nb\nc", "a\nx\nc").map((line) => [line.type, line.text])
    ).toEqual([
      ["same", "a"],
      ["remove", "b"],
      ["add", "x"],
      ["same", "c"],
    ]);
  });
});

describe("formatEntryBeancount", () => {
  it("formats open/close/balance/note/event", () => {
    expect(
      formatEntryBeancount("open", {
        date: "2022-01-01",
        account: "Assets:Cash",
        currency: "USD,EUR",
      })
    ).toBe("2022-01-01 open Assets:Cash USD,EUR");
    expect(
      formatEntryBeancount("close", { date: "2022-01-01", account: "Assets:Cash" })
    ).toBe("2022-01-01 close Assets:Cash");
    expect(
      formatEntryBeancount("balance", {
        date: "2022-01-01",
        account: "Assets:Cash",
        number: "10",
        currency: "USD",
      })
    ).toBe("2022-01-01 balance Assets:Cash 10 USD");
    expect(
      formatEntryBeancount("note", {
        date: "2022-01-01",
        account: "Assets:Cash",
        comment: "hello",
      })
    ).toBe('2022-01-01 note Assets:Cash "hello"');
    expect(
      formatEntryBeancount("event", {
        date: "2022-01-01",
        type: "location",
        description: "Paris",
      })
    ).toBe('2022-01-01 event "location" "Paris"');
  });
});
