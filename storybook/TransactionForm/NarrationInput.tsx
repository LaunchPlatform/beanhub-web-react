import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import NarrationInput from "../../src/TransactionForm/NarrationInput";

export default {
  title: "NarrationInput",
  component: NarrationInput,
} as ComponentMeta<typeof NarrationInput>;

export const Primary: ComponentStory<typeof NarrationInput> = () => (
  <NarrationInput />
);

export const Error: ComponentStory<typeof NarrationInput> = () => (
  <NarrationInput error="Required" />
);
