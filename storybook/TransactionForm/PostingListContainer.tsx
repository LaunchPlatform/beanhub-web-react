import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import PostingListContainer from "../../src/TransactionForm/PostingListContainer";

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
  title: "PostingListContainer",
  component: PostingListContainer,
} as ComponentMeta<typeof PostingListContainer>;

export const Primary: ComponentStory<typeof PostingListContainer> = () => (
  <PostingListContainer index={0} accounts={accounts} currencies={currencies} />
);
