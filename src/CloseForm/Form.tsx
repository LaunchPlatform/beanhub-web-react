import React, { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import Selection from "../Shared/Selection";
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
  readonly hiddenFields?: Record<string, string>;
  readonly files: Array<string>;
  readonly accounts: Array<string>;
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
  hiddenFields,
  files,
  accounts,
  errors,
}: Props) => {
  let initialFileValue = initialFile;
  let initialDateValue = initialDate;
  let initialAccountValue = initialAccount;
  if (window.history.state?.file !== undefined) {
    initialFileValue = window.history.state?.file;
  }
  if (window.history.state?.date !== undefined) {
    initialDateValue = window.history.state?.date;
  }
  if (window.history.state?.account !== undefined) {
    initialAccountValue = window.history.state?.account;
  }

  return (
    <form action={action} method={method ?? "POST"}>
      <Selection
        title="File"
        name="file"
        values={files}
        initialValue={initialFileValue}
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
      <Selection
        title="Account"
        name="account"
        values={accounts}
        initialValue={initialAccountValue}
        error={accountError}
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
