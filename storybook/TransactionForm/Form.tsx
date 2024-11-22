import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form from "../../src/TransactionForm/Form";
import { PriceMode } from "../../src/TransactionForm/PostingInput";
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

export default {
  component: Form,
} as ComponentMeta<typeof Form>;

export const Primary: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);

export const InputPrefix: ComponentStory<typeof Form> = () => (
  <InputPrefixContext.Provider value="forms-0-">
    <Form
      files={files}
      accounts={accounts}
      accountCurrencies={accountCurrencies}
      defaultCurrencies={defaultCurrencies}
    />
  </InputPrefixContext.Provider>
);

export const InitialValues: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    initialNarration="This "
    initialPayee="Jane Doe"
    initialDate="2022-03-02"
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
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);

export const InitialPriceValues: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    initialNarration="This "
    initialPayee="Jane Doe"
    initialDate="2022-03-02"
    initialPostings={[
      { account: "Assets", unitNumber: "-12.34", unitCurrency: "USD" },
      {
        account: "Expenses",
        unitNumber: "12.34",
        unitCurrency: "USD",
        priceMode: PriceMode.PRICE.toString() as any,
        priceNumber: "45.67",
        priceCurrency: "BTC",
      },
    ]}
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);

export const Errors: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    dateError="Bad date format"
    payeeError="Bad payee value"
    narrationError="Narration required"
    initialPostings={[{ accountError: "Bad account" }]}
    initialMeta={[
      {
        metaKeyError: "Invalid key value",
      },
    ]}
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
    errors={["Account number not balanced", "Currency is not supported"]}
  />
);
