import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import PostingInput, {
  CostMode,
  PriceMode,
} from "../../src/TransactionForm/PostingInput";

export default {
  component: PostingInput,
  argTypes: { onDelete: { action: "clicked" } },
} as ComponentMeta<typeof PostingInput>;

const baseProps = {
  name: "postings",
  account: "",
  unitNumber: "",
  unitCurrency: "",
  onDelete: action("onDelete"),
  onAccountChange: action("onAccountChange"),
  onUnitNumberChange: action("onUnitNumberChange"),
  onUnitCurrencyChange: action("onUnitCurrencyChange"),
};

export const Primary: ComponentStory<typeof PostingInput> = () => (
  <PostingInput {...baseProps} />
);

export const WithAccountCandidates: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
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
    {...baseProps}
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
  <PostingInput {...baseProps} accountError="Account required" />
);

export const NumberError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput {...baseProps} unitNumberError="Number required" />
);

export const CurrencyError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput {...baseProps} unitCurrencyError="Currency required" />
);

export const AccountNumberError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    accountError="Account required"
    unitNumberError="Number required"
  />
);

export const NumberCurrencyError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    unitNumberError="Number required"
    unitCurrencyError="Currency required"
  />
);

export const AllError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    accountError="Account required"
    unitNumberError="Number required"
    unitCurrencyError="Currency required"
  />
);

export const Price: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    priceMode={PriceMode.PRICE}
    onPriceButtonClick={action("onPriceButtonClick")}
    onPriceNumberChange={action("onPriceNumberChange")}
    onPriceCurrencyChange={action("onPriceCurrencyChange")}
  />
);

export const TotalPrice: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    priceMode={PriceMode.TOTAL_PRICE}
    onPriceButtonClick={action("onPriceButtonClick")}
    onPriceNumberChange={action("onPriceNumberChange")}
    onPriceCurrencyChange={action("onPriceCurrencyChange")}
  />
);

export const PriceAllError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    priceMode={PriceMode.PRICE}
    accountError="Account required"
    unitNumberError="Number required"
    unitCurrencyError="Currency required"
    priceNumberError="Number required"
    priceCurrencyError="Currency required"
    onPriceButtonClick={action("onPriceButtonClick")}
  />
);

export const WithPriceCurrencyCandidates: ComponentStory<
  typeof PostingInput
> = () => (
  <PostingInput
    {...baseProps}
    priceMode={PriceMode.PRICE}
    onAccountCandidateClick={action("onAccountCandidateClick")}
    onPriceButtonClick={action("onPriceButtonClick")}
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

export const AdvancedDetails: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    advanced
    account="Assets:Investments"
    unitNumber="10"
    unitCurrency="HOOL"
    flag="!"
    costMode={CostMode.COST}
    costNumber="123.45"
    costCurrency="USD"
    costDate="2022-01-15"
    costLabel="lot-a"
    priceMode={PriceMode.PRICE}
    priceNumber="1.2"
    priceCurrency="EUR"
    onFlagChange={action("onFlagChange")}
    onCostModeChange={action("onCostModeChange")}
    onCostNumberChange={action("onCostNumberChange")}
    onCostCurrencyChange={action("onCostCurrencyChange")}
    onCostDateChange={action("onCostDateChange")}
    onCostLabelChange={action("onCostLabelChange")}
    onPriceModeChange={action("onPriceModeChange")}
    onPriceNumberChange={action("onPriceNumberChange")}
    onPriceCurrencyChange={action("onPriceCurrencyChange")}
  />
);

export const AdvancedCost: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    advanced
    costMode={CostMode.COST}
    onFlagChange={action("onFlagChange")}
    onCostModeChange={action("onCostModeChange")}
    onCostNumberChange={action("onCostNumberChange")}
    onCostCurrencyChange={action("onCostCurrencyChange")}
    onCostDateChange={action("onCostDateChange")}
    onCostLabelChange={action("onCostLabelChange")}
    onPriceModeChange={action("onPriceModeChange")}
  />
);

export const AdvancedTotalCost: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    advanced
    costMode={CostMode.TOTAL_COST}
    onFlagChange={action("onFlagChange")}
    onCostModeChange={action("onCostModeChange")}
    onCostNumberChange={action("onCostNumberChange")}
    onCostCurrencyChange={action("onCostCurrencyChange")}
    onCostDateChange={action("onCostDateChange")}
    onCostLabelChange={action("onCostLabelChange")}
    onPriceModeChange={action("onPriceModeChange")}
  />
);

export const AdvancedCostAllError: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    advanced
    costMode={CostMode.COST}
    accountError="Account required"
    unitNumberError="Number required"
    unitCurrencyError="Currency required"
    costNumberError="Number required"
    costCurrencyError="Currency required"
    costDateError="Bad date"
    costLabelError="Bad label"
    onFlagChange={action("onFlagChange")}
    onCostModeChange={action("onCostModeChange")}
    onPriceModeChange={action("onPriceModeChange")}
  />
);

export const AdvancedWithFlag: ComponentStory<typeof PostingInput> = () => (
  <PostingInput
    {...baseProps}
    advanced
    flag="!"
    onFlagChange={action("onFlagChange")}
    onCostModeChange={action("onCostModeChange")}
    onPriceModeChange={action("onPriceModeChange")}
  />
);
