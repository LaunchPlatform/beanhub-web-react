import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import PostingInputContainer from "../../src/TransactionForm/PostingInputContainer";

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
  component: PostingInputContainer,
  argTypes: { onDelete: { action: "clicked" } },
} as ComponentMeta<typeof PostingInputContainer>;

export const Primary: ComponentStory<typeof PostingInputContainer> = () => (
  <PostingInputContainer
    name="postings"
    accounts={accounts}
    currencies={currencies}
    onDelete={action("onDelete")}
  />
);

export const Advanced: ComponentStory<typeof PostingInputContainer> = () => (
  <PostingInputContainer
    name="postings"
    advanced
    accounts={accounts}
    currencies={currencies}
    onDelete={action("onDelete")}
  />
);
