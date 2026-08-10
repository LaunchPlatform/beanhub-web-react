import React, { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
import TextInput from "../Shared/TextInput";
import SubmitButton from "../Shared/SubmitButton";
import CurrencyInput from "../Shared/CurrencyInput";
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
  readonly initialCurrencies?: Array<string>;
  readonly currenciesError?: string;
  readonly hiddenFields?: Record<string, string>;
  readonly files: Array<string>;
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
  initialAccount,
  accountError,
  initialCurrencies,
  currenciesError,
  hiddenFields,
  files,
  currencies,
  errors,
}: Props) => {
  let initialFileValue = initialFile;
  let initialDateValue = initialDate;
  let initialCurrenciesValue = initialCurrencies;
  let initialAccountValue = initialAccount;
  const _hist_file = getHistoryValue<typeof initialFileValue>("file");
  if (_hist_file !== undefined) {
    initialFileValue = _hist_file;
  }
  const _hist_date = getHistoryValue<typeof initialDateValue>("date");
  if (_hist_date !== undefined) {
    initialDateValue = _hist_date;
  }
  const _hist_currencies = getHistoryValue<typeof initialCurrenciesValue>("currencies");
  if (_hist_currencies !== undefined) {
    initialCurrenciesValue = _hist_currencies;
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
      <TextInput
        label="Account"
        name="account"
        placeholder="Name of account"
        defaultValue={initialAccountValue}
        error={accountError}
        required
        onChange={(value) => {
          setHistoryValue("account", value);
        }}
      />
      <CurrencyInput
        multiple
        creatable
        currencies={currencies}
        initialValue={initialCurrenciesValue}
        error={currenciesError}
        onChange={(values) => {
          setHistoryValue("currencies", values);
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
