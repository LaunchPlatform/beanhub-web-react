import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import NumberInput from "../../src/Shared/NumberInput";

export default {
  component: NumberInput,
} as ComponentMeta<typeof NumberInput>;

export const Primary: ComponentStory<typeof NumberInput> = () => (
  <NumberInput name="amount" label="Amount" />
);

export const Integer: ComponentStory<typeof NumberInput> = () => (
  <NumberInput name="amount" label="Amount" integer />
);

export const Error: ComponentStory<typeof NumberInput> = () => (
  <NumberInput name="amount" label="Amount" error="Required" />
);
