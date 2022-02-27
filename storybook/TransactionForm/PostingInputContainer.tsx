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

export default {
  title: "PostingInputContainer",
  component: PostingInputContainer,
  argTypes: { onDelete: { action: "clicked" } },
} as ComponentMeta<typeof PostingInputContainer>;

export const Primary: ComponentStory<typeof PostingInputContainer> = () => (
  <PostingInputContainer onDelete={action("onDelete")} accounts={accounts} />
);
