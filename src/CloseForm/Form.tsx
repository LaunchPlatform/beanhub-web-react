import React, { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import Selection from "../Shared/Selection";
import SubmitButton from "../Shared/SubmitButton";
import { getHistoryValue, setHistoryValue } from "../Shared/historyState";

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
  const _hist_file = getHistoryValue<typeof initialFileValue>("file");
  if (_hist_file !== undefined) {
    initialFileValue = _hist_file;
  }
  const _hist_date = getHistoryValue<typeof initialDateValue>("date");
  if (_hist_date !== undefined) {
    initialDateValue = _hist_date;
  }
  const _hist_account = getHistoryValue<typeof initialAccountValue>("account");
  if (_hist_account !== undefined) {
    initialAccountValue = _hist_account;
  }

  return (
    <form action={action} method={method ?? "POST"}>
      <Selection
        title="File"
        name="file"
        values={files}
        initialValue={initialFileValue}
        error={fileError}
        required
        onChange={(value) => {
          setHistoryValue("file", value);
        }}
      />
      <DateInput
        defaultValue={initialDateValue}
        error={dateError}
        required
        onChange={(value) => {
          setHistoryValue("date", value);
        }}
      />
      <Selection
        title="Account"
        name="account"
        values={accounts}
        initialValue={initialAccountValue}
        error={accountError}
        required
        onChange={(value) => {
          setHistoryValue("account", value);
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
