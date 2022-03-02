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

export const WithAccountCandidates: ComponentStory<typeof PostingInput> =
  () => (
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
      accountCandidates={[
        { value: "Assets", prefix: "Assets", suffix: "" },
        { value: "Assets:Bank", prefix: "Assets", suffix: ":Bank" },
        { value: "Assets:Cash", prefix: "Assets", suffix: ":Cash" },
      ]}
    />
  );

export const WithCurrencyCandidates: ComponentStory<typeof PostingInput> =
  () => (
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
      unitCurrencyCandidates={[
        { value: "Assets", prefix: "Assets", suffix: "" },
        { value: "Assets:Bank", prefix: "Assets", suffix: ":Bank" },
        { value: "Assets:Cash", prefix: "Assets", suffix: ":Cash" },
      ]}
    />
  );

export const AccountError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    accountError="Account required"
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);

export const NumberError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    numberError="Number required"
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);

export const CurrencyError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    currencyError="Currency required"
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);

export const AccountNumberError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    accountError="Account required"
    numberError="Number required"
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);

export const NumberCurrencyError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    numberError="Number required"
    currencyError="Currency required"
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);

export const AllError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    accountError="Account required"
    numberError="Number required"
    currencyError="Currency required"
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);
