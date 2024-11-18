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
    defaultMetaKey="import-id"
    defaultMetaValue="MOCK_VALUE"
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);

export const Empty: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);

export const KeyError: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    key="import-id"
    metaKeyError="Invalid key name"
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);

export const ValueError: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    defaultMetaKey="import-id"
    metaValueError="Invalid value"
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);

export const BothError: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    defaultMetaKey="import-id"
    metaKeyError="Invalid key name"
    defaultMetaValue="MOCK_VALUE"
    metaValueError="Invalid value"
    index={0}
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);
