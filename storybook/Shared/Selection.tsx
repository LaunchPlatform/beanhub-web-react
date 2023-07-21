import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import Selection from "../../src/Shared/Selection";

export default {
  component: Selection,
} as ComponentMeta<typeof Selection>;

export const Primary: ComponentStory<typeof Selection> = () => (
  <Selection
    title="File"
    name="file"
    values={["main.bean", "books/2021.bean", "books/2022.bean"]}
  />
);

export const InitialValue: ComponentStory<typeof Selection> = () => (
  <Selection
    title="File"
    name="file"
    values={["main.bean", "books/2021.bean", "books/2022.bean"]}
    initialValue="books/2021.bean"
  />
);

export const Error: ComponentStory<typeof Selection> = () => (
  <Selection
    title="File"
    name="file"
    values={["main.bean", "books/2021.bean", "books/2022.bean"]}
    error="Required"
  />
);
