import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import DateInput from "../../src/Shared/DateInput";

export default {
  component: DateInput,
} as ComponentMeta<typeof DateInput>;

export const Primary: ComponentStory<typeof DateInput> = () => (
  <DateInput defaultValue="2022-02-26" />
);

export const Error: ComponentStory<typeof DateInput> = () => (
  <DateInput defaultValue="2022-02-26" error="Invalid date" />
);
