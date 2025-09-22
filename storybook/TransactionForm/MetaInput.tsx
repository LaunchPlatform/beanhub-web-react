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
    name="metadata"
    defaultMetaKey="import-id"
    defaultMetaValue="MOCK_VALUE"
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);

export const Empty: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    name="metadata"
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);

export const KeyError: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    name="metadata"
    key="import-id"
    metaKeyError="Invalid key name"
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);

export const ValueError: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    name="metadata"
    defaultMetaKey="import-id"
    metaValueError="Invalid value"
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);

export const BothError: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    name="metadata"
    defaultMetaKey="import-id"
    metaKeyError="Invalid key name"
    defaultMetaValue="MOCK_VALUE"
    metaValueError="Invalid value"
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
  />
);

export const KeyReadonly: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    name="metadata"
    defaultMetaKey="import-id"
    defaultMetaValue="MOCK_VALUE"
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
    keyReadonly
  />
);

export const ValueReadonly: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    name="metadata"
    defaultMetaKey="import-id"
    defaultMetaValue="MOCK_VALUE"
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
    valueReadonly
  />
);

export const BothReadonly: ComponentStory<typeof MetaInput> = () => (
  <MetaInput
    name="metadata"
    defaultMetaKey="import-id"
    defaultMetaValue="MOCK_VALUE"
    onKeyChange={action("onKeyChange")}
    onValueChange={action("onValueChange")}
    onDelete={action("onDelete")}
    keyReadonly
    valueReadonly
  />
);
