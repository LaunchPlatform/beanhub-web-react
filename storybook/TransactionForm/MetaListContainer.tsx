import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import MetaListContainer from "../../src/TransactionForm/MetaListContainer";

export default {
  component: MetaListContainer,
} as ComponentMeta<typeof MetaListContainer>;

export const Primary: ComponentStory<typeof MetaListContainer> = () => (
  <MetaListContainer />
);
