import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form from "../../src/OpenForm/Form";

const files: Array<string> = [
  "main.bean",
  "accounts.bean",
  "plugins.bean",
  "prices.bean",
  "others.bean",
  "books/2021.bean",
  "books/2022.bean",
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
  title: "OpenForm/Form",
  component: Form,
} as ComponentMeta<typeof Form>;

export const Primary: ComponentStory<typeof Form> = () => (
  <Form files={files} currencies={currencies} />
);

export const InitialValues: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    initialCurrencies={["USD", "EUR"]}
    initialAccount="Assets:PocketMoney"
    initialDate="2022-03-02"
  />
);

export const Errors: ComponentStory<typeof Form> = () => (
  <Form
    files={files}
    currencies={currencies}
    dateError="Bad date format"
    accountError="Bad account name"
    currenciesError="Bad currency"
    errors={["Currency is not supported"]}
  />
);
