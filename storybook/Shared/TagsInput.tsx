import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import TagsInput from "../../src/Shared/TagsInput";

export default {
  component: TagsInput,
} as ComponentMeta<typeof TagsInput>;

export const Tags: ComponentStory<typeof TagsInput> = () => (
  <TagsInput
    label="Tags"
    name="tags"
    stripPrefix="#"
    initialValue="trip vacation"
    placeholder="Add a tag"
    onChange={action("onChange")}
  />
);

export const Links: ComponentStory<typeof TagsInput> = () => (
  <TagsInput
    label="Links"
    name="links"
    stripPrefix="^"
    initialValue="invoice-42"
    placeholder="Add a link"
    onChange={action("onChange")}
  />
);

export const Empty: ComponentStory<typeof TagsInput> = () => (
  <TagsInput
    label="Tags"
    name="tags"
    stripPrefix="#"
    onChange={action("onChange")}
  />
);

export const WithError: ComponentStory<typeof TagsInput> = () => (
  <TagsInput
    label="Tags"
    name="tags"
    stripPrefix="#"
    initialValue="bad"
    error="Invalid tag"
    onChange={action("onChange")}
  />
);
