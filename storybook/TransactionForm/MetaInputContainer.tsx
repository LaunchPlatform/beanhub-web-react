import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import MetaInputContainer from "../../src/TransactionForm/MetaInputContainer";

export default {
  component: MetaInputContainer,
  argTypes: { onDelete: { action: "clicked" } },
} as ComponentMeta<typeof MetaInputContainer>;

export const Primary: ComponentStory<typeof MetaInputContainer> = () => (
  <MetaInputContainer
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);
