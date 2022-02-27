import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import DateInput from "../../src/TransactionForm/DateInput";

export default {
  title: "DateInput",
  component: DateInput,
} as ComponentMeta<typeof DateInput>;

export const Primary: ComponentStory<typeof DateInput> = () => (
  <DateInput defaultValue="2022-02-26" />
);
