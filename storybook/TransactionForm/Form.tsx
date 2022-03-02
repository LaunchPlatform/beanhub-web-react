import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form from "../../src/TransactionForm/Form";

const files: Array<string> = [
  "main.bean",
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

const currencies: Array<string> = [
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
  <Form files={files} accounts={accounts} currencies={currencies} />
);

export const InitialValues: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    initialNarration="This "
    initialDate="2022-03-02"
    initialPostings={[
      { account: "Assets", unitNumber: "-12.34", unitCurrency: "USD" },
      { account: "Expenses", unitNumber: "12.34", unitCurrency: "USD" },
    ]}
    accounts={accounts}
    currencies={currencies}
  />
);

export const Errors: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    dateError="Bad date format"
    narrationError="Narration required"
    initialPostings={[{ accountError: "Bad account" }]}
    accounts={accounts}
    currencies={currencies}
    errors={["Account number not balanced", "Currency is not supported"]}
  />
);
