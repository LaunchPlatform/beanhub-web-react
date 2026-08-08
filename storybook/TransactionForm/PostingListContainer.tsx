import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import PostingListContainer from "../../src/TransactionForm/PostingListContainer";
import { CostMode } from "../../src/TransactionForm/PostingInput";

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
    name="postings"
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);

export const Advanced: ComponentStory<typeof PostingListContainer> = () => (
  <PostingListContainer
    name="postings"
    advanced
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);

export const InitialValues: ComponentStory<typeof PostingListContainer> = () => (
  <PostingListContainer
    name="postings"
    initialPostings={[
      { account: "Assets", unitNumber: "-12.34", unitCurrency: "USD" },
      { account: "Expenses", unitNumber: "12.34", unitCurrency: "USD" },
    ]}
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);

export const InitialCostValues: ComponentStory<typeof PostingListContainer> = () => (
  <PostingListContainer
    name="postings"
    advanced
    initialPostings={[
      {
        account: "Assets:Investments",
        unitNumber: "10",
        unitCurrency: "HOOL",
        flag: "!",
        costMode: CostMode.COST,
        costNumber: "123.45",
        costCurrency: "USD",
        costDate: "2022-01-15",
        costLabel: "lot-a",
      },
      { account: "Assets:Cash", unitNumber: "-1234.50", unitCurrency: "USD" },
    ]}
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);

export const Error: ComponentStory<typeof PostingListContainer> = () => (
  <PostingListContainer
    name="postings"
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

export const Optional: ComponentStory<typeof PostingListContainer> = () => (
  <PostingListContainer
    name="postings"
    accounts={accounts}
    accountCurrencies={accountCurrencies}
    defaultCurrencies={defaultCurrencies}
  />
);
