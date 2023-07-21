import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import CurrencyInput from "../../src/Shared/CurrencyInput";

export default {
  component: CurrencyInput,
} as ComponentMeta<typeof CurrencyInput>;

export const Multiple: ComponentStory<typeof CurrencyInput> = () => (
  <CurrencyInput currencies={["USD", "BTC", "TWD"]} multiple />
);

export const MultipleInitialValue: ComponentStory<typeof CurrencyInput> =
  () => (
    <CurrencyInput
      currencies={["USD", "BTC", "TWD"]}
      initialValue={["BTC", "USD"]}
      multiple
    />
  );

export const MultipleError: ComponentStory<typeof CurrencyInput> = () => (
  <CurrencyInput currencies={["USD", "BTC", "TWD"]} error="Required" multiple />
);

export const MultipleCreatable: ComponentStory<typeof CurrencyInput> = () => (
  <CurrencyInput currencies={["USD", "BTC", "TWD"]} multiple creatable />
);

export const MultipleCreatableInitialValue: ComponentStory<
  typeof CurrencyInput
> = () => (
  <CurrencyInput
    currencies={["USD", "BTC", "TWD"]}
    initialValue={["BTC", "USD"]}
    multiple
    creatable
  />
);

export const MultipleCreatableError: ComponentStory<typeof CurrencyInput> =
  () => (
    <CurrencyInput
      currencies={["USD", "BTC", "TWD"]}
      error="Required"
      multiple
      creatable
    />
  );
