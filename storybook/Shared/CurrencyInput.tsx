import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import CurrencyInput from "../../src/Shared/CurrencyInput";

export default {
  title: "OpenForm/CurrencyInput",
  component: CurrencyInput,
} as ComponentMeta<typeof CurrencyInput>;

export const Primary: ComponentStory<typeof CurrencyInput> = () => (
  <CurrencyInput currencies={["USD", "BTC", "TWD"]} />
);

export const InitialValue: ComponentStory<typeof CurrencyInput> = () => (
  <CurrencyInput
    currencies={["USD", "BTC", "TWD"]}
    initialValues={["BTC", "USD"]}
  />
);

export const Error: ComponentStory<typeof CurrencyInput> = () => (
  <CurrencyInput currencies={["USD", "BTC", "TWD"]} error="Required" />
);
