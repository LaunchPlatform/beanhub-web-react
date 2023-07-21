import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import PostingCandidateList from "../../src/TransactionForm/PostingCandidateList";

export default {
  component: PostingCandidateList,
} as ComponentMeta<typeof PostingCandidateList>;

export const Primary: ComponentStory<typeof PostingCandidateList> = () => (
  <PostingCandidateList
    activeIndex={0}
    candidates={[
      { value: "Assets", prefix: "Assets", suffix: "" },
      { value: "Assets:Bank", prefix: "Assets", suffix: ":Bank" },
      { value: "Assets:Cash", prefix: "Assets", suffix: ":Cash" },
    ]}
    onClick={action("onClick")}
  />
);
