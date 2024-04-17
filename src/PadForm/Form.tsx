import { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
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
  readonly initialSourceAccount?: string;
  readonly sourceAccountError?: string;
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
  initialSourceAccount,
  sourceAccountError,
  hiddenFields,
  files,
  accounts,
  errors,
}: Props) => {
  let initialFileValue = initialFile;
  let initialDateValue = initialDate;
  let initialAccountValue = initialAccount;
  let initialSourceAccountValue = initialSourceAccount;
  if (window.history.state?.file !== undefined) {
    initialFileValue = window.history.state?.file;
  }
  if (window.history.state?.date !== undefined) {
    initialDateValue = window.history.state?.date;
  }
  if (window.history.state?.source_account !== undefined) {
    initialSourceAccountValue = window.history.state?.source_account;
  }
  if (window.history.state?.account !== undefined) {
    initialAccountValue = window.history.state?.account;
  }

  return (
    <form action={action} method={method ?? "POST"}>
      <SelectionInput
        title="File"
        name="file"
        values={files}
        initialValue={initialFileValue}
        error={fileError}
        required
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
        required
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
      <SelectionInput
        title="Account"
        name="account"
        values={accounts}
        initialValue={initialAccountValue}
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
      <SelectionInput
        title="Source Account"
        name="source_account"
        values={accounts}
        initialValue={initialSourceAccountValue}
        error={sourceAccountError}
        required
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              source_account: value,
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
