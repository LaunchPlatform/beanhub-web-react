import React, { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
import TextInput from "../Shared/TextInput";
import SubmitButton from "../Shared/SubmitButton";
import { getHistoryValue, setHistoryValue } from "../Shared/historyState";

export interface Props {
  readonly action?: string;
  readonly method?: string;
  readonly initialFile?: string;
  readonly fileError?: string;
  readonly initialDate?: string;
  readonly dateError?: string;
  readonly initialSymbol?: string;
  readonly symbolError?: string;
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
  initialSymbol,
  symbolError,
  hiddenFields,
  files,
  errors,
}: Props) => {
  let initialFileValue = initialFile;
  let initialDateValue = initialDate;
  let initialSymbolValue = initialSymbol;
  const _hist_file = getHistoryValue<typeof initialFileValue>("file");
  if (_hist_file !== undefined) {
    initialFileValue = _hist_file;
  }
  const _hist_date = getHistoryValue<typeof initialDateValue>("date");
  if (_hist_date !== undefined) {
    initialDateValue = _hist_date;
  }
  const _hist_symbol = getHistoryValue<typeof initialSymbolValue>("symbol");
  if (_hist_symbol !== undefined) {
    initialSymbolValue = _hist_symbol;
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
        label="Symbol"
        name="symbol"
        placeholder="Symbol of commodity, such as USD, BTC"
        defaultValue={initialSymbolValue}
        error={symbolError}
        required
        onChange={(value) => {
          setHistoryValue("symbol", value);
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
