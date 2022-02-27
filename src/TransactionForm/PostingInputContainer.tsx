import React, { FunctionComponent, useEffect, useState } from "react";
import PostingCandidateList, { Candidate } from "./PostingCandidateList";
import PostingInput from "./PostingInput";

export interface Props {
  readonly account?: string;
  readonly unitNumber?: string;
  readonly unitCurrency?: string;
  readonly accounts?: Array<string>;
  readonly onDelete?: () => void;
}

const PostingInputContainer: FunctionComponent<Props> = ({
  account,
  unitNumber,
  unitCurrency,
  accounts: accountCandidates,
  onDelete,
}: Props) => {
  const [accountValue, setAccountValue] = useState<string | undefined>(account);
  const [activeCandidateIndex, setActiveCandidateIndex] = useState<number>(0);
  const lowerAccountValue = (accountValue ?? "").trim().toLowerCase();
  const matchedAccounts: Array<Candidate> =
    accountValue !== undefined
      ? (accountCandidates ?? [])
          .filter((account) =>
            account.toLowerCase().startsWith(lowerAccountValue)
          )
          .map((account) => ({
            account,
            prefix: account.substring(0, accountValue.length),
            suffix: account.substring(accountValue.length, account.length),
          }))
      : [];
  return (
    <PostingInput
      account={accountValue}
      index={activeCandidateIndex}
      candidates={matchedAccounts}
      onAccountChange={(value) => {
        setAccountValue(value);
      }}
    />
  );
};

export default PostingInputContainer;
