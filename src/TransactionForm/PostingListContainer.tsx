import React, { FunctionComponent, useState, useEffect } from "react";
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
  readonly accountCurrencies: Record<string, Array<string>>;
  readonly defaultCurrency: string;
}

const PostingListContainer: FunctionComponent<Props> = ({
  initialPostings,
  accounts,
  accountCurrencies,
  defaultCurrency,
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
  let initialState = (filledInitialPostings ?? [{}, {}]).map(
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
  );
  if (window.history.state?.postings !== undefined) {
    initialState = window.history.state.postings;
  }
  useEffect(() => {
    if (window.history.state?.postings === undefined) {
      window.history.replaceState(
        {
          ...window.history.state,
          postings: initialState,
        },
        ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [postingsState, setPostingsState] =
    useState<Array<PostingRecordState>>(initialState);
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
          currencies={
            accountCurrencies[posting.account.trim()] ?? [defaultCurrency]
          }
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
            window.history.replaceState(
              {
                ...window.history.state,
                postings: newPostings,
              },
              ""
            );
          }}
          onUnitNumberChange={(unitNumber) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              unitNumber,
            };
            setPostingsState(newPostings);
            window.history.replaceState(
              {
                ...window.history.state,
                postings: newPostings,
              },
              ""
            );
          }}
          onUnitCurrencyChange={(unitCurrency) => {
            let newPostings = [...postingsState];
            newPostings[index] = {
              ...newPostings[index],
              unitCurrency,
            };
            setPostingsState(newPostings);
            window.history.replaceState(
              {
                ...window.history.state,
                postings: newPostings,
              },
              ""
            );
          }}
          onDelete={() => {
            if (postingsState.length <= 2) {
              return;
            }
            const newPostings = postingsState.filter(
              (item) => item.key !== posting.key
            );
            setPostingsState(newPostings);
            window.history.replaceState(
              {
                ...window.history.state,
                postings: newPostings,
              },
              ""
            );
          }}
        />
      ))}
    </FormRow>
  );
};

export default PostingListContainer;
