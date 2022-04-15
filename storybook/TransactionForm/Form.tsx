import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form from "../../src/TransactionForm/Form";

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
  title: "Form",
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
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
    errors={["Account number not balanced", "Currency is not supported"]}
  />
);
