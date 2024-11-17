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
    key="import-id"
    value="MOCK_VALUE"
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
  />
);

export const Empty: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    key=""
    value=""
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
  />
);

export const KeyError: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    key="import-id"
    keyError="Invalid key name"
    value=""
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
  />
);

export const ValueError: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    key="import-id"
    value="MOCK_VALUE"
    valueError="Invalid value"
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
  />
);

export const BothError: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    key="import-id"
    keyError="Invalid key name"
    value="MOCK_VALUE"
    valueError="Invalid value"
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
  />
);
