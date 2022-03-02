import React, { FunctionComponent } from "react";
import DateInput from "./DateInput";
import ErrorRow from "./ErrorRow";
import FileInput from "./FileInput";
import NarrationInput from "./NarrationInput";
import PostingListContainer, { PostingRecord } from "./PostingListContainer";
import SubmitButton from "./SubmitButton";

export interface Props {
  readonly action?: string;
  readonly method?: string;
  readonly initialDate?: string;
  readonly dateError?: string;
  readonly initialNarration?: string;
  readonly narrationError?: string;
  readonly initialPostings?: Array<PostingRecord>;
  readonly hiddenFields?: Record<string, string>;
  readonly files: Array<string>;
  readonly accounts: Array<string>;
  readonly currencies: Array<string>;
  readonly errors?: Array<string>;
}

const Form: FunctionComponent<Props> = ({
  action,
  method,
  initialDate,
  dateError,
  initialNarration,
  narrationError,
  initialPostings,
  hiddenFields,
  files,
  accounts,
  currencies,
  errors,
}: Props) => (
  <form action={action} method={method ?? "POST"}>
    <FileInput files={files} />
    <DateInput defaultValue={initialDate} error={dateError} />
    <NarrationInput defaultValue={initialNarration} error={narrationError} />
    <PostingListContainer
      initialPostings={initialPostings}
      accounts={accounts}
      currencies={currencies}
    />
    {hiddenFields !== undefined
      ? Object.entries(hiddenFields).map(([key, value]) => (
          <input type="hidden" name={key} value={value} />
        ))
      : null}
    {(errors ?? []).map((error, index) => (
      <ErrorRow key={index} message={error} />
    ))}
    <SubmitButton title="Create" />
  </form>
);
export default Form;
