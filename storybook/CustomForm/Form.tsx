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

const fields: Array<Field> = [
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
    creatable: true,
  },
  {
    name: "account",
    displayName: "The Account",
    type: FieldType.account,
    creatable: true,
  },
  {
    name: "str",
    displayName: "The String",
    type: FieldType.str,
  },
  {
    name: "number",
    displayName: "The Number",
    type: FieldType.number,
  },
];

export default {
  component: Form,
} as ComponentMeta<typeof Form>;

export const Primary: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    accounts={accounts}
    fields={fields}
  />
);

export const Required: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    accounts={accounts}
    fields={fields.map((field) => ({ ...field, required: true }))}
  />
);

export const Error: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    accounts={accounts}
    fields={fields.map((field) => ({ ...field, error: "Required" }))}
  />
);

const defaultValues = {
  date: "2023-07-21",
  file: "books/2022.bean",
  currency: ["USD", "BTC"],
  str: "My txn",
  number: "123.45",
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
  />
);
