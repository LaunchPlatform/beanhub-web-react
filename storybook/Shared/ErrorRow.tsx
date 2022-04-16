import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import ErrorRow from "../../src/Shared/ErrorRow";

export default {
  title: "Shared/ErrorRow",
  component: ErrorRow,
} as ComponentMeta<typeof ErrorRow>;

export const Primary: ComponentStory<typeof ErrorRow> = () => (
  <ErrorRow message="Account number not balanced" />
);
