// Button.stories.ts|tsx

import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import FileInput from "../../src/TransactionForm/FileInput";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "FileInput",
  component: FileInput,
} as ComponentMeta<typeof FileInput>;

export const Primary: ComponentStory<typeof FileInput> = () => (
  <FileInput>Button</FileInput>
);
