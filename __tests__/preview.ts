import { it, expect, describe, jest } from "@jest/globals";
import {
  formatNumber,
  formatPostingCost,
  formatPostingLine,
  formatTransactionBeancount,
  calculateColumnWidths,
} from "../src/TransactionForm/preview";
import { CostMode, PriceMode } from "../src/TransactionForm/PostingInput";
import {
  FORM_MODE_HISTORY_KEY,
  persistFormMode,
  readFormModeFromHistory,
  resolveInitialFormMode,
  shouldUseAdvancedMode,
} from "../src/TransactionForm/formMode";
import {
  normalizePostingState,
  normalizePostingStates,
} from "../src/TransactionForm/postingState";
import { normalizeMetaState } from "../src/TransactionForm/metaState";
import {
  beancountLinesEqual,
  computeInlineSegments,
  computeLineDiff,
  normalizeBeancountLine,
} from "../src/Shared/diff";
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
  it("aligns account and number columns from content widths", () => {
    const widths = calculateColumnWidths([
      {
        flag: "!",
        account: "Assets:Investments",
        unitNumber: "10",
        unitCurrency: "HOOL",
      },
    ]);
    expect(
      formatPostingLine(
        {
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
        },
        widths,
        { reserveFlagColumn: true }
      )
    ).toBe("! Assets:Investments 10 HOOL {12 USD} @ 1.5 EUR");
  });

  it("reserves a flag column so amounts stay aligned", () => {
    const postings = [
      {
        flag: "*",
        account: "Assets:Cash",
        unitNumber: "-5",
        unitCurrency: "USD",
      },
      {
        account: "Expenses:Food",
        unitNumber: "5",
        unitCurrency: "USD",
      },
    ];
    const widths = calculateColumnWidths(postings);
    expect(formatPostingLine(postings[0], widths, { reserveFlagColumn: true })).toBe(
      `* ${"Assets:Cash".padEnd(widths.accountWidth)} ${"-5".padStart(
        widths.numberWidth
      )} USD`
    );
    expect(formatPostingLine(postings[1], widths, { reserveFlagColumn: true })).toBe(
      `  ${"Expenses:Food".padEnd(widths.accountWidth)} ${"5".padStart(
        widths.numberWidth
      )} USD`
    );
  });

  it("does not pad short postings without amounts", () => {
    expect(formatPostingLine({ account: "Assets:Cash" })).toBe("Assets:Cash");
  });

  it("keeps a typed negative number in the preview without currency", () => {
    const widths = calculateColumnWidths([
      { account: "Assets:Foobar", unitNumber: "-1" },
    ]);
    expect(
      formatPostingLine({ account: "Assets:Foobar", unitNumber: "-1" }, widths)
    ).toBe(`${"Assets:Foobar".padEnd(widths.accountWidth)} -1`);
  });

  it("coerces numeric unit amounts so -1 is not dropped", () => {
    const widths = calculateColumnWidths([
      {
        account: "Assets:Foobar",
        unitNumber: -1 as unknown as string,
        unitCurrency: "USD",
      },
    ]);
    expect(
      formatPostingLine(
        {
          account: "Assets:Foobar",
          unitNumber: -1 as unknown as string,
          unitCurrency: "USD",
        },
        widths
      )
    ).toBe(`${"Assets:Foobar".padEnd(widths.accountWidth)} -1 USD`);
  });
});

describe("formatTransactionBeancount", () => {
  it("formats a full transaction with compact aligned layout", () => {
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
        '  Assets:Investments        10 HOOL {123.45 USD, 2022-01-15, "lot-a"}',
        "  Assets:Cash        -1,234.50 USD",
      ].join("\n")
    );
  });

  it("keeps posting amounts aligned when one posting has a flag", () => {
    expect(
      formatTransactionBeancount({
        date: "2022-03-02",
        flag: "*",
        narration: "Coffee",
        payee: "Jane Doe",
        postings: [
          {
            flag: "*",
            account: "Assets:Cash",
            unitNumber: "-5",
            unitCurrency: "USD",
            costMode: CostMode.COST,
            costNumber: "555",
            costCurrency: "BTC",
          },
          {
            account: "Expenses:Food",
            unitNumber: "5",
            unitCurrency: "USD",
          },
        ],
      })
    ).toBe(
      [
        '2022-03-02 * "Jane Doe" "Coffee"',
        "  * Assets:Cash   -5 USD {555 BTC}",
        "    Expenses:Food  5 USD",
      ].join("\n")
    );
  });

  it("includes a typed -1 amount on the second posting", () => {
    expect(
      formatTransactionBeancount({
        date: "2026-08-18",
        flag: "*",
        narration: "gg",
        postings: [
          {
            account: "Assets:Cash",
            unitNumber: "1",
            unitCurrency: "USD",
          },
          {
            account: "Assets:Foobar",
            unitNumber: "-1",
            unitCurrency: "USD",
          },
        ],
      })
    ).toBe(
      [
        '2026-08-18 * "gg"',
        "  Assets:Cash    1 USD",
        "  Assets:Foobar -1 USD",
      ].join("\n")
    );
  });
});

describe("shouldUseAdvancedMode", () => {
  it("defaults to simple", () => {
    expect(shouldUseAdvancedMode({})).toBe(false);
  });

  it("keeps default txn flag and null cost/price modes in simple", () => {
    expect(shouldUseAdvancedMode({ initialFlag: "*" })).toBe(false);
    expect(shouldUseAdvancedMode({ initialFlag: "" })).toBe(false);
    expect(
      shouldUseAdvancedMode({
        initialFlag: "*",
        initialPostings: [
          {
            account: "Assets:Cash",
            unitNumber: "-5.00",
            unitCurrency: "USD",
            // Backend serializes unset WTForms fields as null
            costMode: null as unknown as undefined,
            costNumber: null as unknown as undefined,
            costCurrency: null as unknown as undefined,
            costDate: null as unknown as undefined,
            costLabel: null as unknown as undefined,
            priceMode: null as unknown as undefined,
            priceNumber: null as unknown as undefined,
            priceCurrency: null as unknown as undefined,
            flag: null as unknown as undefined,
          },
        ],
      })
    ).toBe(false);
  });

  it("turns on for tags and non-default flag", () => {
    expect(shouldUseAdvancedMode({ initialTags: "food" })).toBe(true);
    expect(shouldUseAdvancedMode({ initialFlag: "!" })).toBe(true);
  });

  it("turns on for posting costs and prices", () => {
    expect(
      shouldUseAdvancedMode({
        initialPostings: [{ costMode: CostMode.COST, costNumber: "1" }],
      })
    ).toBe(true);
    expect(
      shouldUseAdvancedMode({
        initialPostings: [{ priceMode: PriceMode.PRICE, priceNumber: "1" }],
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

describe("formMode history", () => {
  it("reads formMode from a history.state object", () => {
    expect(readFormModeFromHistory(null)).toBeUndefined();
    expect(readFormModeFromHistory({})).toBeUndefined();
    expect(
      readFormModeFromHistory({ [FORM_MODE_HISTORY_KEY]: "advanced" })
    ).toBe("advanced");
    expect(
      readFormModeFromHistory({ [FORM_MODE_HISTORY_KEY]: "simple" })
    ).toBe("simple");
    expect(readFormModeFromHistory({ [FORM_MODE_HISTORY_KEY]: "other" })).toBe(
      undefined
    );
  });

  it("persistFormMode writes formMode into window.history.state", () => {
    const replaceState = jest.fn();
    const previous = global.window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = {
      history: {
        state: { payee: "kept" },
        replaceState,
      },
    };
    try {
      persistFormMode("advanced");
      expect(replaceState).toHaveBeenCalledWith(
        { payee: "kept", [FORM_MODE_HISTORY_KEY]: "advanced" },
        ""
      );
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window = previous;
    }
  });

  it("resolveInitialFormMode prefers history over inference", () => {
    const previous = global.window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = {
      history: {
        state: { [FORM_MODE_HISTORY_KEY]: "simple" },
        replaceState: jest.fn(),
      },
    };
    try {
      expect(
        resolveInitialFormMode({ initialFlag: "!", initialTags: "food" })
      ).toBe("simple");
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window = previous;
    }
  });

  it("resolveInitialFormMode infers when history has no formMode", () => {
    const previous = global.window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = {
      history: { state: null, replaceState: jest.fn() },
    };
    try {
      expect(resolveInitialFormMode({ initialFlag: "!" })).toBe("advanced");
      expect(resolveInitialFormMode({ initialFlag: "*" })).toBe("simple");
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window = previous;
    }
  });
});

describe("normalizeBeancountLine", () => {
  it("collapses insignificant whitespace outside strings", () => {
    expect(
      normalizeBeancountLine(
        "  Liabilities:CreditCard:US:ChaseSapphirePreferred           -5.40 USD"
      )
    ).toBe("Liabilities:CreditCard:US:ChaseSapphirePreferred -5.40 USD");
    expect(
      normalizeBeancountLine(
        "  Liabilities:CreditCard:US:ChaseSapphirePreferred -5.40 USD"
      )
    ).toBe("Liabilities:CreditCard:US:ChaseSapphirePreferred -5.40 USD");
  });

  it("preserves spaces inside quoted strings", () => {
    expect(
      normalizeBeancountLine('2022-03-02 * "Jane  Doe" "Morning  coffee"')
    ).toBe('2022-03-02 * "Jane  Doe" "Morning  coffee"');
    expect(
      normalizeBeancountLine('  import-src: "path/with  spaces.csv"')
    ).toBe('import-src: "path/with  spaces.csv"');
  });

  it("handles escaped quotes inside strings", () => {
    expect(normalizeBeancountLine('  note: "say \\"hi\\""')).toBe(
      'note: "say \\"hi\\""'
    );
  });
});

describe("beancountLinesEqual", () => {
  it("treats column-alignment differences as equal", () => {
    expect(
      beancountLinesEqual(
        "  Expenses:Travel                                             5.40 USD",
        "  Expenses:Travel                                   5.40 USD"
      )
    ).toBe(true);
  });

  it("still distinguishes real content changes", () => {
    expect(
      beancountLinesEqual(
        "  Expenses:Travel 5.40 USD",
        "  Expenses:Travel 6.40 USD"
      )
    ).toBe(false);
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

  it("ignores posting column-alignment differences", () => {
    const original = [
      '2026-06-12 * "Uber"',
      '  import-id: "bBwQxELJaZu8VPoDA958CNND5gaNZKfv3aBdo"',
      "  Liabilities:CreditCard:US:ChaseSapphirePreferred           -5.40 USD",
      "  Expenses:Travel                                             5.40 USD",
    ].join("\n");
    const updated = [
      '2026-06-12 * "Uber"',
      '  import-id: "bBwQxELJaZu8VPoDA958CNND5gaNZKfv3aBdo"',
      "  Liabilities:CreditCard:US:ChaseSapphirePreferred -5.40 USD",
      "  Expenses:Travel                                   5.40 USD",
    ].join("\n");

    expect(
      computeLineDiff(original, updated).map((line) => [line.type, line.text])
    ).toEqual([
      ["same", '2026-06-12 * "Uber"'],
      ["same", '  import-id: "bBwQxELJaZu8VPoDA958CNND5gaNZKfv3aBdo"'],
      ["same", "  Liabilities:CreditCard:US:ChaseSapphirePreferred -5.40 USD"],
      ["same", "  Expenses:Travel                                   5.40 USD"],
    ]);
  });

  it("still highlights real amount changes amid spacing noise", () => {
    const original = [
      '2026-06-12 * "Uber"',
      "  Liabilities:CreditCard:US:ChaseSapphirePreferred           -5.40 USD",
      "  Expenses:Travel                                             5.40 USD",
    ].join("\n");
    const updated = [
      '2026-06-12 * "Uber"',
      "  Liabilities:CreditCard:US:ChaseSapphirePreferred -6.40 USD",
      "  Expenses:Travel                                   6.40 USD",
    ].join("\n");

    expect(
      computeLineDiff(original, updated).map((line) => [line.type, line.text])
    ).toEqual([
      ["same", '2026-06-12 * "Uber"'],
      [
        "remove",
        "  Liabilities:CreditCard:US:ChaseSapphirePreferred           -5.40 USD",
      ],
      [
        "remove",
        "  Expenses:Travel                                             5.40 USD",
      ],
      [
        "add",
        "  Liabilities:CreditCard:US:ChaseSapphirePreferred -6.40 USD",
      ],
      ["add", "  Expenses:Travel                                   6.40 USD"],
    ]);
  });

  it("annotates character-level segments on paired remove/add lines", () => {
    const lines = computeLineDiff(
      '2026-04-26 * "Uber"',
      '2026-04-26 ! "asdf" "Uber"'
    );
    expect(lines.map((line) => line.type)).toEqual(["remove", "add"]);
    expect(lines[0].segments?.some((s) => s.changed && s.text.includes("*"))).toBe(
      true
    );
    expect(
      lines[1].segments?.some((s) => s.changed && s.text.includes("asdf"))
    ).toBe(true);
    expect(
      lines[0].segments?.some((s) => !s.changed && s.text.includes("2026-04-26"))
    ).toBe(true);
    expect(
      lines[1].segments?.some((s) => !s.changed && s.text.includes("Uber"))
    ).toBe(true);
  });
});

describe("computeInlineSegments", () => {
  it("marks only the changed digits in an amount", () => {
    expect(computeInlineSegments("6.33 USD", "6.34 USD")).toEqual({
      original: [
        { text: "6.3", changed: false },
        { text: "3", changed: true },
        { text: " USD", changed: false },
      ],
      updated: [
        { text: "6.3", changed: false },
        { text: "4", changed: true },
        { text: " USD", changed: false },
      ],
    });
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

describe("history draft normalization", () => {
  it("adds keys and coerces null cost/price modes from plain records", () => {
    const normalized = normalizePostingState({
      account: "Assets:Cash",
      unitNumber: "1",
      unitCurrency: "USD",
      costMode: null,
      priceMode: null,
    });
    expect(normalized.key.length).toBeGreaterThan(0);
    expect(normalized.costMode).toBe(CostMode.INACTIVE);
    expect(normalized.priceMode).toBe(PriceMode.INACTIVE);
    expect(normalizePostingStates([{ account: "A" }, { account: "B" }])).toHaveLength(
      2
    );
  });

  it("preserves existing posting keys from history state", () => {
    const normalized = normalizePostingState({
      key: "keep-me",
      account: "Assets:Cash",
      costMode: CostMode.COST,
      priceMode: PriceMode.PRICE,
    });
    expect(normalized.key).toBe("keep-me");
    expect(normalized.costMode).toBe(CostMode.COST);
    expect(normalized.priceMode).toBe(PriceMode.PRICE);
  });

  it("adds keys for plain metadata records", () => {
    const normalized = normalizeMetaState({
      metaKey: "import-id",
      metaValue: "x",
    });
    expect(normalized.key.length).toBeGreaterThan(0);
    expect(normalized.metaKey).toBe("import-id");
    expect(normalizeMetaState({ key: "m1", metaKey: "a", metaValue: "b" }).key).toBe(
      "m1"
    );
  });
});
