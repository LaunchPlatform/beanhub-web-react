import React, { FunctionComponent } from "react";
import DateInput from "./DateInput";
import FileInput from "./FileInput";
import NarrationInput from "./NarrationInput";
import PostingListContainer, { PostingRecord } from "./PostingListContainer";
import SubmitButton from "./SubmitButton";

export interface Props {
  readonly action?: string;
  readonly method?: string;
  readonly initialDate?: string;
  readonly initialNarration?: string;
  readonly initialPostings?: Array<PostingRecord>;
  readonly files: Array<string>;
  readonly accounts: Array<string>;
  readonly currencies: Array<string>;
}

const Form: FunctionComponent<Props> = ({
  action,
  method,
  initialDate,
  initialNarration,
  initialPostings,
  files,
  accounts,
  currencies,
}: Props) => (
  <form action={action} method={method ?? "POST"}>
    <FileInput files={files} />
    <DateInput defaultValue={initialDate} />
    <NarrationInput defaultValue={initialNarration} />
    <PostingListContainer
      initialPostings={initialPostings}
      accounts={accounts}
      currencies={currencies}
    />
    <SubmitButton title="Create" />
  </form>
);
export default Form;
