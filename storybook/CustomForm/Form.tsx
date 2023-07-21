import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form, { FieldType } from "../../src/CustomForm/Form";

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

export default {
  component: Form,
} as ComponentMeta<typeof Form>;

export const Primary: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    accounts={accounts}
    fields={[
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
        name: "str",
        displayName: "The String",
        type: FieldType.str,
      },
      {
        name: "int",
        displayName: "The Integer",
        type: FieldType.int,
      },
    ]}
  />
);
