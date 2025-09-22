import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form, { Field, FieldType } from "../../src/CustomForm/Form";

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

const today = "2023-07-22";

const fields: Array<Field> = [
  {
    name: "header0",
    displayName: "books/2025.bean:123",
    type: FieldType.header,
  },
  {
    name: "date",
    displayName: "The Date",
    type: FieldType.date,
  },
  {
    name: "file",
    displayName: "The File",
    type: FieldType.file,
  },
  {
    name: "currency",
    displayName: "The Currency",
    type: FieldType.currency,
    multiple: true,
  },
  {
    name: "account",
    displayName: "The Account",
    type: FieldType.account,
  },
  {
    name: "str",
    displayName: "The String",
    type: FieldType.str,
    placeholder: "Custom place holder here",
  },
  {
    name: "number",
    displayName: "The Number",
    type: FieldType.number,
  },
  {
    name: "postings",
    displayName: "Postings",
    type: FieldType.postings,
  },
  {
    name: "meta",
    displayName: "Meta",
    type: FieldType.meta,
  },
];

const accountCurrencies = {
  Assets: ["USD"],
  "Assets:Bank": ["USD", "TWD"],
  "Assets:Cash": ["USD", "EUR"],
  Expenses: ["USD", "TWD", "BTC"],
  "Expenses:Office": ["USD"],
  Equity: ["USD"],
  "Equity:CommonStock": ["USD"],
};

export default {
  component: Form,
} as ComponentMeta<typeof Form>;

export const Primary: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    fields={fields}
    defaultDate={today}
  />
);

export const Required: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    fields={fields.map((field) => ({ ...field, required: true }))}
    defaultDate={today}
  />
);

export const Error: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    fields={fields.map((field) => ({ ...field, error: "Required" }))}
    defaultDate={today}
  />
);

const defaultValues = {
  date: "2023-07-21",
  file: "books/2022.bean",
  currency: ["USD", "BTC"],
  str: "My txn",
  number: "123.45",
  postings: [
    {
      account: "Assets:Cash",
      unitNumber: "123.45",
      unitCurrency: "USD",
    },
    {
      account: "Expenses:Office",
      unitNumber: "-123.45",
      unitCurrency: "USD",
    },
  ],
  meta: [
    {
      metaKey: "doc",
      metaValue: "my-invoice.pdf",
    },
  ],
};

export const DefaultValues: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    accounts={accounts}
    fields={fields.map((field) => ({
      ...field,
      default: defaultValues[field.name],
    }))}
    accountCurrencies={accountCurrencies}
    defaultDate={today}
  />
);

export const Creatable: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    accounts={accounts}
    fields={fields.map((field) => ({
      ...field,
      ...([FieldType.file, FieldType.account, FieldType.currency].includes(
        field.type
      )
        ? { creatable: true }
        : {}),
    }))}
    accountCurrencies={accountCurrencies}
    defaultDate={today}
  />
);
