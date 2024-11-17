import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import MetaInput from "../../src/TransactionForm/MetaInput";

export default {
  component: MetaInput,
  argTypes: { onDelete: { action: "clicked" } },
} as ComponentMeta<typeof MetaInput>;

export const Primary: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    key=""
    value=""
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
  />
);
