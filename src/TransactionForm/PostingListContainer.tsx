import React, { FunctionComponent, useState } from "react";
import { v4 as uuid } from "uuid";
import FormRow from "./FormRow";
import PostingInputContainer from "./PostingInputContainer";

export interface PostingRecord {
  readonly account?: string;
  readonly accountError?: string;
  readonly unitNumber?: string;
  readonly unitNumberError?: string;
  readonly unitCurrency?: string;
  readonly unitCurrencyError?: string;
}

interface PostingRecordState {
  readonly key: string;
  readonly account: string;
  readonly accountError?: string;
  readonly unitNumber: string;
  readonly unitNumberError?: string;
  readonly unitCurrency: string;
  readonly unitCurrencyError?: string;
}

export interface Props {
  readonly initialPostings?: Array<PostingRecord>;
  readonly accounts: Array<string>;
  readonly currencies: Array<string>;
}

const PostingListContainer: FunctionComponent<Props> = ({
  initialPostings,
  accounts,
  currencies,
}: Props) => {
  let filledInitialPostings = initialPostings;
  if (filledInitialPostings !== undefined && filledInitialPostings.length < 2) {
    // Fill up to 2 postings if it's not already
    const toFillCount = 2 - filledInitialPostings.length;
    for (let i = 0; i < toFillCount; i++) {
      filledInitialPostings = [
        ...filledInitialPostings,
        {
          key: uuid(),
          account: "",
          unitNumber: "",
          unitCurrency: "",
        } as PostingRecordState,
      ];
    }
  }
  const [postingsState, setPostingsState] = useState<Array<PostingRecordState>>(
    (filledInitialPostings ?? [{}, {}]).map(
      (posting) =>
        ({
          key: uuid(),
          account: posting.account ?? "",
          accountError: posting.accountError,
          unitNumber: posting.unitNumber ?? "",
          unitNumberError: posting.unitNumberError,
          unitCurrency: posting.unitCurrency ?? "",
          unitCurrencyError: posting.unitCurrencyError,
        } as PostingRecordState)
    )
  );
  return (
    <FormRow title="Postings" required>
      {postingsState.map((posting, index) => (
        <PostingInputContainer
          key={posting.key}
          index={index}
          account={posting.account}
          accountError={posting.accountError}
          unitNumber={posting.unitNumber}
          unitNumberError={posting.unitNumberError}
          unitCurrency={posting.unitCurrency}
          unitCurrencyError={posting.unitCurrencyError}
          accounts={accounts}
          currencies={currencies}
          onAccountChange={(account) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              account,
            };
            if (newPostings.every((item) => item.account.trim().length > 0)) {
              // Append a new posting
              newPostings = [
                ...newPostings,
                {
                  key: uuid(),
                  account: "",
                  unitNumber: "",
                  unitCurrency: "",
                } as PostingRecordState,
              ];
            }
            setPostingsState(newPostings);
          }}
          onDelete={() => {
            if (postingsState.length <= 2) {
              return;
            }
            setPostingsState(
              postingsState.filter((item) => item.key !== posting.key)
            );
          }}
        />
      ))}
    </FormRow>
  );
};

export default PostingListContainer;
