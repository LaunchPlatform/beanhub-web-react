import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
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
  <PostingListContainer accounts={accounts} currencies={currencies} />
);
