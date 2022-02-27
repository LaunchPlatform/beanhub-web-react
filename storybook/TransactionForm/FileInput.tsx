import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import FileInput from "../../src/TransactionForm/FileInput";

export default {
  title: "FileInput",
  component: FileInput,
} as ComponentMeta<typeof FileInput>;

export const Primary: ComponentStory<typeof FileInput> = () => (
  <FileInput files={["main.bean", "books/2021.bean", "books/2022.bean"]} />
);
