import React, { FunctionComponent, useEffect, useState } from "react";
import PostingCandidateList, { Candidate } from "./PostingCandidateList";
import PostingInput from "./PostingInput";

export interface Props {
  readonly index: number;
  readonly account?: string;
  readonly unitNumber?: string;
  readonly unitCurrency?: string;
  readonly accounts: Array<string>;
  readonly onDelete?: () => void;
}

const PostingInputContainer: FunctionComponent<Props> = ({
  account,
  unitNumber,
  unitCurrency,
  accounts,
  index,
  onDelete,
}: Props) => {
  const [accountValue, setAccountValue] = useState<string>(account ?? "");
  const [unitNumberValue, setUnitNumberValue] = useState<string>(
    unitNumber ?? ""
  );
  const [unitCurrencyValue, setUnitCurrencyValue] = useState<string>(
    unitCurrency ?? ""
  );
  const [accountCandidateIndex, setAccountCandidateIndex] = useState<number>(0);
  const [displayAccountCandidates, setDisplayAccountCandidates] =
    useState<boolean>(false);
  const lowerAccountValue = (accountValue ?? "").trim().toLowerCase();
  const matchedAccounts: Array<Candidate> | undefined =
    accountValue !== undefined
      ? accounts
          .filter((account) =>
            account.toLowerCase().startsWith(lowerAccountValue)
          )
          .map((account) => ({
            account,
            prefix: account.substring(0, accountValue.length),
            suffix: account.substring(accountValue.length, account.length),
          }))
      : undefined;
  return (
    <PostingInput
      account={accountValue}
      unitNumber={unitNumberValue}
      unitCurrency={unitCurrencyValue}
      index={index}
      accountCandidates={displayAccountCandidates ? matchedAccounts : undefined}
      accountCandidateIndex={accountCandidateIndex}
      onAccountChange={(value) => {
        setAccountValue(value);
        setDisplayAccountCandidates(true);
      }}
      onAccountKeyDown={(event) => {
        let delta = 0;
        if (event.key === "Tab") {
          if (!displayAccountCandidates) {
            // we are not showing candidates, just jump to next input
            return;
          }
          delta = event.shiftKey ? -1 : 1;
        } else if (event.key === "ArrowUp") {
          delta = -1;
        } else if (event.key === "ArrowDown") {
          delta = 1;
        }
        if (delta !== 0) {
          const size = matchedAccounts!.length;
          const nextIndex = (accountCandidateIndex + size + delta) % size;
          setAccountCandidateIndex(nextIndex);
          event.preventDefault();
        }
      }}
      onAccountKeyPress={(event) => {
        if (event.key === "Enter" || event.key === "Space") {
          setAccountValue(accounts[accountCandidateIndex]);
          setDisplayAccountCandidates(false);
          event.preventDefault();
        }
      }}
      onAccountCandidateClick={(value) => {
        setAccountValue(value);
        setDisplayAccountCandidates(false);
      }}
    />
  );
};

export default PostingInputContainer;
