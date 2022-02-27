import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import PostingCandidateList from "../../src/TransactionForm/PostingCandidateList";

export default {
  title: "PostingCandidateList",
  component: PostingCandidateList,
} as ComponentMeta<typeof PostingCandidateList>;

export const Primary: ComponentStory<typeof PostingCandidateList> = () => (
  <PostingCandidateList
    candidates={[
      { account: "Assets", prefix: "Assets", suffix: "" },
      { account: "Assets:Bank", prefix: "Assets", suffix: ":Bank" },
      { account: "Assets:Cash", prefix: "Assets", suffix: ":Cash" },
    ]}
    onClick={action("onClick")}
  />
);
