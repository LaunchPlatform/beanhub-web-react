import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import PostingInput, {
  PriceMode,
} from "../../src/TransactionForm/PostingInput";
import { text } from "stream/consumers";

export default {
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

export const WithAccountCandidates: ComponentStory<typeof PostingInput> = () => (
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
      {
        value: "Assets",
        matchedPieces: [
          { text: "Ass", matched: true },
          { text: "ets", matched: false },
        ],
      },
      {
        value: "Assets:Bank",
        matchedPieces: [
          { text: "Ass", matched: true },
          { text: "ets", matched: false },
        ],
      },
      {
        value: "Assets:Cash",
        matchedPieces: [
          { text: "Ass", matched: true },
          { text: "ets", matched: false },
        ],
      },
    ]}
  />
);

export const WithCurrencyCandidates: ComponentStory<typeof PostingInput> = () => (
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
      { value: "BTC", matchedPieces: [{ text: "BTC", matched: true }] },
      {
        value: "BTC_CASH",
        matchedPieces: [
          { text: "BTC", matched: true },
          { text: "_CASH", matched: false },
        ],
      },
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
    unitNumberError="Number required"
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
    unitCurrencyError="Currency required"
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
    unitNumberError="Number required"
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
    unitNumberError="Number required"
    unitCurrencyError="Currency required"
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
    unitNumberError="Number required"
    unitCurrencyError="Currency required"
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);

export const Price: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    priceMode={PriceMode.PRICE}
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
    onPriceNumberChange={action("onPriceNumberChange")}
    onPriceCurrencyChange={action("onPriceCurrencyChange")}
  />
);

export const TotalPrice: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    priceMode={PriceMode.TOTAL_PRICE}
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
    onPriceNumberChange={action("onPriceNumberChange")}
    onPriceCurrencyChange={action("onPriceCurrencyChange")}
  />
);

export const PriceAllError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    priceMode={PriceMode.PRICE}
    accountError="Account required"
    unitNumberError="Number required"
    unitCurrencyError="Currency required"
    priceNumberError="Number required"
    priceCurrencyError="Currency required"
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
  />
);

export const WithPriceCurrencyCandidates: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    account=""
    unitNumber=""
    unitCurrency=""
    index={0}
    priceMode={PriceMode.PRICE}
    onDelete={action("onDelete")}
    onAccountChange={action("onAccountChange")}
    onUnitNumberChange={action("onUnitNumberChange")}
    onUnitCurrencyChange={action("onUnitCurrencyChange")}
    onAccountCandidateClick={action("onAccountCandidateClick")}
    priceCurrencyCandidates={[
      { value: "BTC", matchedPieces: [{ text: "BTC", matched: true }] },
      {
        value: "BTC_CASH",
        matchedPieces: [
          { text: "BTC", matched: true },
          { text: "_CASH", matched: false },
        ],
      },
    ]}
  />
);
