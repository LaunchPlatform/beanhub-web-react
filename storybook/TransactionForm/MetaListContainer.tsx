import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import MetaListContainer from "../../src/TransactionForm/MetaListContainer";

export default {
  component: MetaListContainer,
} as ComponentMeta<typeof MetaListContainer>;

export const Primary: ComponentStory<typeof MetaListContainer> = () => (
  <MetaListContainer name="metadata" />
);

export const InitialValue: ComponentStory<typeof MetaListContainer> = () => (
  <MetaListContainer
    name="metadata"
    initialMeta={[{ metaKey: "mock-key", metaValue: "mock-value" }]}
  />
);

export const InitialReadonlyItem: ComponentStory<typeof MetaListContainer> = () => (
  <MetaListContainer
    name="metadata"
    initialMeta={[
      {
        metaKey: "mock-key",
        metaValue: "mock-value",
        metaKeyReadonly: true,
        metaValueReadonly: true,
      },
    ]}
  />
);
