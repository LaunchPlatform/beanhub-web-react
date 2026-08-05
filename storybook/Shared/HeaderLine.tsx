import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import HeaderLine from "../../src/Shared/HeaderLine";

export default {
  component: HeaderLine,
} as ComponentMeta<typeof HeaderLine>;

export const Primary: ComponentStory<typeof HeaderLine> = () => (
  <HeaderLine title="books/2025.bean:1234" />
);

export const Linked: ComponentStory<typeof HeaderLine> = () => (
  <HeaderLine
    title="books/2024.bean:128"
    href="/repos/alice/ledger/blob/main/books/2024.bean#L128"
  />
);
