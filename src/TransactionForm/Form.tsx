import React, { FunctionComponent } from "react";
import DateInput from "./DateInput";
import ErrorRow from "./ErrorRow";
import FileInput from "./FileInput";
import TextInput from "./TextInput";
import PostingListContainer, { PostingRecord } from "./PostingListContainer";
import SubmitButton from "./SubmitButton";

export interface Props {
  readonly action?: string;
  readonly method?: string;
  readonly initialFile?: string;
  readonly fileError?: string;
  readonly initialDate?: string;
  readonly dateError?: string;
  readonly initialPayee?: string;
  readonly payeeError?: string;
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
  initialFile,
  fileError,
  initialDate,
  dateError,
  initialPayee,
  payeeError,
  initialNarration,
  narrationError,
  initialPostings,
  hiddenFields,
  files,
  accounts,
  currencies,
  errors,
}: Props) => {
  let initialFileValue = initialFile;
  let initialDateValue = initialDate;
  let initialNarrationValue = initialNarration;
  let initialPayeeValue = initialPayee;
  if (window.history.state?.file !== undefined) {
    initialFileValue = window.history.state?.file;
  }
  if (window.history.state?.date !== undefined) {
    initialDateValue = window.history.state?.date;
  }
  if (window.history.state?.narration !== undefined) {
    initialNarrationValue = window.history.state?.narration;
  }
  if (window.history.state?.payee !== undefined) {
    initialPayeeValue = window.history.state?.payee;
  }

  return (
    <form action={action} method={method ?? "POST"}>
      <FileInput
        files={files}
        initialFile={initialFileValue}
        error={fileError}
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              file: value,
            },
            ""
          );
        }}
      />
      <DateInput
        defaultValue={initialDateValue}
        error={dateError}
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              date: value,
            },
            ""
          );
        }}
      />
      <TextInput
        label="Payee"
        name="payee"
        placeholder="Payee of the transaction"
        defaultValue={initialPayeeValue}
        error={payeeError}
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              payee: value,
            },
            ""
          );
        }}
      />
      <TextInput
        label="Narration"
        name="narration"
        placeholder="Narration of the transaction"
        defaultValue={initialNarrationValue}
        error={narrationError}
        required
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              narration: value,
            },
            ""
          );
        }}
      />
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
};
export default Form;
