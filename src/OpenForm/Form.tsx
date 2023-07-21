import React, { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
import TextInput from "../Shared/TextInput";
import SubmitButton from "../Shared/SubmitButton";
import CurrencyInput from "../Shared/CurrencyInput";

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
  if (window.history.state?.file !== undefined) {
    initialFileValue = window.history.state?.file;
  }
  if (window.history.state?.date !== undefined) {
    initialDateValue = window.history.state?.date;
  }
  if (window.history.state?.currencies !== undefined) {
    initialCurrenciesValue = window.history.state?.currencies;
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
      <CurrencyInput
        currencies={currencies}
        initialValues={initialCurrenciesValue}
        error={currenciesError}
        onChange={(values) => {
          window.history.replaceState(
            {
              ...window.history.state,
              currencies: values,
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
