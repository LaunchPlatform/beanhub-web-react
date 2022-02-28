import React, { FunctionComponent, useState } from "react";
import PostingInputContainer from "./PostingInputContainer";
import { v4 as uuid } from "uuid";
import FormRow from "./FormRow";

export interface PostingRecord {
  readonly account?: string;
  readonly unitNumber?: string;
  readonly unitCurrency?: string;
}

interface PostingRecordState {
  readonly key: string;
  readonly account: string;
  readonly unitNumber: string;
  readonly unitCurrency: string;
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
  const [postingsState, setPostingsState] = useState<Array<PostingRecordState>>(
    (initialPostings ?? [{}, {}]).map(
      (posting) =>
        ({
          key: uuid(),
          account: posting.account ?? "",
          unitNumber: posting.unitNumber ?? "",
          unitCurrency: posting.unitCurrency ?? "",
        } as PostingRecordState)
    )
  );
  return (
    <FormRow title="Postings" required>
      {postingsState.map((posting, index) => (
        <PostingInputContainer
          key={posting.key}
          index={index}
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
