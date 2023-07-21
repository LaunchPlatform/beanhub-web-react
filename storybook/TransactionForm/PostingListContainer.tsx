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

const accountCurrencies: Record<string, Array<string>> = {
  Assets: ["USD", "BTC", "EUR", "TWD"],
  "Assets:Bank": ["TWD"],
  "Assets:Cash": ["BTC"],
};

const defaultCurrencies: Array<string> = [
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
  component: PostingListContainer,
} as ComponentMeta<typeof PostingListContainer>;

export const Primary: ComponentStory<typeof PostingListContainer> = () => (
  <PostingListContainer
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);

export const InitialValues: ComponentStory<typeof PostingListContainer> =
  () => (
    <PostingListContainer
      initialPostings={[
        { account: "Assets", unitNumber: "-12.34", unitCurrency: "USD" },
        { account: "Expenses", unitNumber: "12.34", unitCurrency: "USD" },
      ]}
      accounts={accounts}
      accountCurrencies={accountCurrencies}
      defaultCurrencies={defaultCurrencies}
    />
  );

export const Error: ComponentStory<typeof PostingListContainer> = () => (
  <PostingListContainer
    initialPostings={[
      {
        account: "Assets",
        accountError: "Account is required",
        unitNumber: "-12.34",
        unitCurrency: "USD",
      },
      { account: "Expenses", unitNumber: "12.34", unitCurrency: "USD" },
    ]}
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);
