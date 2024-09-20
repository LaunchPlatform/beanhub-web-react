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
      {
        value: "Assets",
        matchedPieces: [
          { text: "A", matched: true },
          { text: "sse", matched: false },
          { text: "ts", matched: true },
        ],
      },
      {
        value: "Assets:Bank",
        matchedPieces: [
          { text: "A", matched: true },
          { text: "sse", matched: false },
          { text: "ts", matched: true },
          { text: ":Bank", matched: false },
        ],
      },
      {
        value: "Assets:Cash",
        matchedPieces: [
          { text: "A", matched: true },
          { text: "sse", matched: false },
          { text: "ts", matched: true },
          { text: ":Cash", matched: false },
        ],
      },
    ]}
    onClick={action("onClick")}
  />
);
