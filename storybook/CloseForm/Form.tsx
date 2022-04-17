import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form from "../../src/CloseForm/Form";

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

export default {
  title: "CloseForm/Form",
  component: Form,
} as ComponentMeta<typeof Form>;

export const Primary: ComponentStory<typeof Form> = () => (
  <Form files={files} accounts={accounts} />
);

export const InitialValues: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    accounts={accounts}
    initialAccount="Expenses:Office"
    initialDate="2022-03-02"
  />
);

export const Errors: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    accounts={accounts}
    dateError="Bad date format"
    accountError="Bad account name"
    errors={["Account does not exists"]}
  />
);
