import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import TextInput from "../../src/Shared/TextInput";

export default {
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

export const Primary: ComponentStory<typeof TextInput> = () => (
  <TextInput name="narration" label="Narration" />
);

export const Error: ComponentStory<typeof TextInput> = () => (
  <TextInput name="narration" label="Narration" error="Required" />
);
