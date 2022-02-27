import React, { FunctionComponent } from "react";
import DateInput from "./DateInput";
import FileInput from "./FileInput";
import NarrationInput from "./NarrationInput";
import PostingListContainer, { PostingRecord } from "./PostingListContainer";

export interface Props {
  readonly action: string;
  readonly initialDate?: string;
  readonly initialNarration?: string;
  readonly initialPostings?: Array<PostingRecord>;
  readonly files: Array<string>;
  readonly accounts: Array<string>;
  readonly currencies: Array<string>;
}

const Form: FunctionComponent<Props> = ({
  action,
  initialDate,
  initialNarration,
  initialPostings,
  files,
  accounts,
  currencies,
}: Props) => (
  <form action={action}>
    <FileInput files={files} />
    <DateInput defaultValue={initialDate} />
    <NarrationInput defaultValue={initialNarration} />
    <PostingListContainer
      initialPostings={initialPostings}
      accounts={accounts}
      currencies={currencies}
    />
  </form>
);
export default Form;
