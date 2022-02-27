import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import PostingInput from "../../src/TransactionForm/PostingInput";

export default {
  title: "PostingInput",
  component: PostingInput,
  argTypes: { onDelete: { action: "clicked" } },
} as ComponentMeta<typeof PostingInput>;

export const Primary: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    index={0}
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);
