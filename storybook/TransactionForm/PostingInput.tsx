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
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);

export const WithCandidates: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
    onAccountCandidateClick={action("onAccountCandidateClick")}
    candidates={[
      { account: "Assets", prefix: "Assets", suffix: "" },
      { account: "Assets:Bank", prefix: "Assets", suffix: ":Bank" },
      { account: "Assets:Cash", prefix: "Assets", suffix: ":Cash" },
    ]}
  />
);
