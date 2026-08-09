import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form from "../../src/TransactionForm/Form";
import { CostMode, PriceMode } from "../../src/TransactionForm/PostingInput";
import { InputPrefixContext } from "../../src/TransactionForm/context";

const files: Array<string> = [
  "main.bean",
  "accounts.bean",
  "plugins.bean",
  "prices.bean",
  "others.bean",
  "books/2021.bean",
  "books/2022.bean",
];

const accounts: Array<string> = [
  "Assets",
  "Assets:Bank",
  "Assets:Cash",
  "Expenses",
  "Expenses:Office",
  "Equity",
  "Equity:CommonStock",
];

const accountCurrencies: Record<string, Array<string>> = {
  Assets: ["USD", "BTC", "EUR", "TWD"],
  "Assets:Bank": ["TWD"],
  "Assets:Cash": ["BTC"],
};

const defaultCurrencies: Array<string> = [
  "USD",
  "UYU",
  "UZS",
  "BTC",
  "EUR",
  "TVD",
  "TWD",
  "TZS",
];

const shared = {
  files,
  accounts,
  accountCurrencies,
  defaultCurrencies,
};

export default {
  component: Form,
} as ComponentMeta<typeof Form>;

export const Primary: ComponentStory<typeof Form> = () => (
  <Form {...shared} />
);

export const WithPreview: ComponentStory<typeof Form> = () => (
  <Form
    {...shared}
    showPreview
    initialDate="2022-03-02"
    initialPayee="Jane Doe"
    initialNarration="Coffee"
    initialPostings={[
      { account: "Assets:Cash", unitNumber: "-5", unitCurrency: "USD" },
      { account: "Expenses:Food", unitNumber: "5", unitCurrency: "USD" },
    ]}
  />
);

/** Diff baseline is the initial form values (structured), not file plaintext. */
export const WithDiffPreview: ComponentStory<typeof Form> = () => (
  <Form
    {...shared}
    showPreview
    initialDate="2022-03-02"
    initialPayee="Jane Doe"
    initialNarration="Morning coffee"
    initialPostings={[
      { account: "Assets:Cash", unitNumber: "-6", unitCurrency: "USD" },
      { account: "Expenses:Food", unitNumber: "6", unitCurrency: "USD" },
    ]}
  />
);

export const InputPrefix: ComponentStory<typeof Form> = () => (
  <InputPrefixContext.Provider value="forms-0-">
    <Form {...shared} />
  </InputPrefixContext.Provider>
);

export const InitialValues: ComponentStory<typeof Form> = () => (
  <Form
    {...shared}
    showPreview
    initialNarration="This "
    initialPayee="Jane Doe"
    initialDate="2022-03-02"
    initialFlag="!"
    initialTags="trip vacation"
    initialLinks="invoice-42"
    initialPostings={[
      { account: "Assets", unitNumber: "-12.34", unitCurrency: "USD" },
      { account: "Expenses", unitNumber: "12.34", unitCurrency: "USD" },
    ]}
    initialMeta={[
      {
        metaKey: "import-id",
        metaValue:
          "import-data/connect/American Express/My Account/2023.csv:123",
      },
      {
        metaKey: "import-src",
        metaValue: "import-data/connect/American Express/My Account/2023.csv",
      },
    ]}
  />
);

export const InitialPriceValues: ComponentStory<typeof Form> = () => (
  <Form
    {...shared}
    showPreview
    initialNarration="This "
    initialPayee="Jane Doe"
    initialDate="2022-03-02"
    initialPostings={[
      { account: "Assets", unitNumber: "-12.34", unitCurrency: "USD" },
      {
        account: "Expenses",
        unitNumber: "12.34",
        unitCurrency: "USD",
        priceMode: PriceMode.PRICE,
        priceNumber: "45.67",
        priceCurrency: "BTC",
      },
    ]}
  />
);

export const InitialCostValues: ComponentStory<typeof Form> = () => (
  <Form
    {...shared}
    showPreview
    initialNarration="Buy shares"
    initialPayee="Broker"
    initialDate="2022-03-02"
    initialFlag="*"
    initialPostings={[
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
      { account: "Assets:Cash", unitNumber: "-1234.50", unitCurrency: "USD" },
    ]}
  />
);

export const ForcedSimpleMode: ComponentStory<typeof Form> = () => (
  <Form
    {...shared}
    initialMode="simple"
    showPreview
    initialFlag="!"
    initialTags="hidden-in-ui"
    initialDate="2022-03-02"
    initialNarration="Still submitted via hidden fields"
    initialPostings={[
      { account: "Assets", unitNumber: "-1", unitCurrency: "USD" },
      { account: "Expenses", unitNumber: "1", unitCurrency: "USD" },
    ]}
  />
);

export const ForcedAdvancedMode: ComponentStory<typeof Form> = () => (
  <Form {...shared} initialMode="advanced" showPreview />
);

export const Errors: ComponentStory<typeof Form> = () => (
  <Form
    {...shared}
    dateError="Bad date format"
    flagError="Flag must be * or !"
    payeeError="Bad payee value"
    narrationError="Narration required"
    tagsError="Invalid tag"
    linksError="Invalid link"
    initialPostings={[{ accountError: "Bad account" }]}
    initialMeta={[
      {
        metaKeyError: "Invalid key value",
      },
    ]}
    errors={["Account number not balanced", "Currency is not supported"]}
  />
);
