import React, { FunctionComponent, useEffect, useState } from "react";
import PostingCandidateList from "./PostingCandidateList";
import PostingInput from "./PostingInput";

export interface Props {
  readonly account?: string;
  readonly unitNumber?: string;
  readonly unitCurrency?: string;
  readonly onDelete?: () => void;
}

const PostingInputContainer: FunctionComponent<Props> = ({
  account,
  unitNumber,
  unitCurrency,
  onDelete,
}: Props) => {
  const [accountValue, setAccountValue] = useState<string | undefined>(account);
  const [activeCandidateIndex, setActiveCandidateIndex] = useState<number>(0);
  return (
    <PostingInput
      account={accountValue}
      index={activeCandidateIndex}
      onAccountChange={(value) => {
        setAccountValue(value);
      }}
    />
  );
};

export default PostingInputContainer;
