import { it, expect, describe } from "@jest/globals";
import {
  formatNumber,
  formatPostingCost,
  formatPostingLine,
  formatTransactionBeancount,
  calculateColumnWidths,
  DEFAULT_ACCOUNT_WIDTH,
  DEFAULT_NUMBER_WIDTH,
  BALANCE_PREFIX_WIDTH,
  DEFAULT_INDENT_WIDTH,
} from "../src/TransactionForm/preview";
import { CostMode, PriceMode } from "../src/TransactionForm/PostingInput";
import { shouldUseAdvancedMode } from "../src/TransactionForm/formMode";
import { computeLineDiff } from "../src/Shared/diff";
import { formatEntryBeancount } from "../src/TransactionForm/preview";

describe("formatNumber", () => {
  it("adds thousand separators and preserves decimals", () => {
    expect(formatNumber("1234.50")).toBe("1,234.50");
    expect(formatNumber("-1234567.0")).toBe("-1,234,567.0");
    expect(formatNumber("10")).toBe("10");
    expect(formatNumber("1,234")).toBe("1,234");
  });

  it("leaves non-plain numbers alone", () => {
    expect(formatNumber("(1 + 2)")).toBe("(1 + 2)");
  });
});

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

  it("formats total cost with thousand separators", () => {
    expect(
      formatPostingCost({
        costMode: CostMode.TOTAL_COST,
        costNumber: "1000",
        costCurrency: "USD",
      })
    ).toBe("{{1,000 USD}}");
  });
});

describe("formatPostingLine", () => {
  it("aligns account and number columns like beancount-black", () => {
    const accountWidth = DEFAULT_ACCOUNT_WIDTH;
    const numberWidth = DEFAULT_NUMBER_WIDTH;
    const accountFieldWidth =
      accountWidth + (BALANCE_PREFIX_WIDTH - DEFAULT_INDENT_WIDTH);
    const account = "Assets:Investments".padEnd(accountFieldWidth);
    const number = "10".padStart(numberWidth);
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
    ).toBe(`! ${account} ${number} HOOL {12 USD} @ 1.5 EUR`);
  });

  it("does not pad short postings without amounts", () => {
    expect(formatPostingLine({ account: "Assets:Cash" })).toBe("Assets:Cash");
  });
});

describe("formatTransactionBeancount", () => {
  it("formats a full transaction with black-style layout", () => {
    const widths = calculateColumnWidths([
      {
        account: "Assets:Investments",
        unitNumber: "10",
        unitCurrency: "HOOL",
      },
      {
        account: "Assets:Cash",
        unitNumber: "-1234.50",
        unitCurrency: "USD",
      },
    ]);
    const accountFieldWidth =
      widths.accountWidth + (BALANCE_PREFIX_WIDTH - DEFAULT_INDENT_WIDTH);
    const investments = "Assets:Investments".padEnd(accountFieldWidth);
    const cash = "Assets:Cash".padEnd(accountFieldWidth);
    const ten = "10".padStart(widths.numberWidth);
    const cashAmount = "-1,234.50".padStart(widths.numberWidth);

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
        '2022-03-02 * "Broker" "Buy shares" ^invoice-42 #trip #vacation',
        '  import-id: "abc"',
        `  ${investments} ${ten} HOOL {123.45 USD, 2022-01-15, "lot-a"}`,
        `  ${cash} ${cashAmount} USD`,
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

    const account = "Assets:Cash".padEnd(DEFAULT_ACCOUNT_WIDTH);
    const number = "10".padStart(DEFAULT_NUMBER_WIDTH);
    expect(
      formatEntryBeancount("balance", {
        date: "2022-01-01",
        account: "Assets:Cash",
        number: "10",
        currency: "USD",
      })
    ).toBe(`2022-01-01 balance ${account} ${number} USD`);

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
