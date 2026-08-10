import { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
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
  const _hist_file = getHistoryValue<typeof initialFileValue>("file");
  if (_hist_file !== undefined) {
    initialFileValue = _hist_file;
  }
  const _hist_date = getHistoryValue<typeof initialDateValue>("date");
  if (_hist_date !== undefined) {
    initialDateValue = _hist_date;
  }
  const _hist_source_account = getHistoryValue<typeof initialSourceAccountValue>("source_account");
  if (_hist_source_account !== undefined) {
    initialSourceAccountValue = _hist_source_account;
  }
  const _hist_account = getHistoryValue<typeof initialAccountValue>("account");
  if (_hist_account !== undefined) {
    initialAccountValue = _hist_account;
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
      <SelectionInput
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
      <SelectionInput
        title="Source Account"
        name="source_account"
        values={accounts}
        initialValue={initialSourceAccountValue}
        error={sourceAccountError}
        required
        onChange={(value) => {
          setHistoryValue("source_account", value);
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
