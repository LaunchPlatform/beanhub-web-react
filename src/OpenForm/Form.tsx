import React, { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import FileInput from "../Shared/FileInput";
import TextInput from "../Shared/TextInput";
import SubmitButton from "../Shared/SubmitButton";

export interface Props {
  readonly action?: string;
  readonly method?: string;
  readonly initialFile?: string;
  readonly fileError?: string;
  readonly initialDate?: string;
  readonly dateError?: string;
  readonly initialAccount?: string;
  readonly accountError?: string;
  readonly initialNarration?: string;
  readonly narrationError?: string;
  readonly hiddenFields?: Record<string, string>;
  readonly files: Array<string>;
  readonly errors?: Array<string>;
}

const Form: FunctionComponent<Props> = ({
  action,
  method,
  initialFile,
  fileError,
  initialDate,
  dateError,
  initialAccount,
  accountError,
  initialNarration,
  narrationError,
  hiddenFields,
  files,
  errors,
}: Props) => {
  let initialFileValue = initialFile;
  let initialDateValue = initialDate;
  let initialNarrationValue = initialNarration;
  let initialAccountValue = initialAccount;
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
    initialAccountValue = window.history.state?.payee;
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
        label="Account"
        name="account"
        placeholder="Name of account"
        defaultValue={initialAccountValue}
        error={accountError}
        required
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              account: value,
            },
            ""
          );
        }}
      />
      {hiddenFields !== undefined
        ? Object.entries(hiddenFields).map(([key, value]) => (
            <input type="hidden" name={key} value={value} />
          ))
        : null}
      {(errors ?? []).map((error, index) => (
        <ErrorRow key={index} message={error} />
      ))}
      <SubmitButton title="Add" />
    </form>
  );
};
export default Form;
