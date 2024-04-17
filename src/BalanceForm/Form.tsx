import { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import NumberInput from "../Shared/NumberInput";
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
  readonly initialNumber?: string;
  readonly numberError?: string;
  readonly initialTolerance?: string;
  readonly toleranceError?: string;
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
  initialNumber,
  numberError,
  initialTolerance,
  toleranceError,
  hiddenFields,
  files,
  accounts,
  errors,
}: Props) => {
  let initialFileValue = initialFile;
  let initialDateValue = initialDate;
  let initialAccountValue = initialAccount;
  let initialNumberValue = initialNumber;
  let initialToleranceValue = initialTolerance;
  if (window.history.state?.file !== undefined) {
    initialFileValue = window.history.state?.file;
  }
  if (window.history.state?.date !== undefined) {
    initialDateValue = window.history.state?.date;
  }
  if (window.history.state?.number !== undefined) {
    initialNumberValue = window.history.state?.number;
  }
  if (window.history.state?.tolerance !== undefined) {
    initialToleranceValue = window.history.state?.tolerance;
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
      <NumberInput
        label="Number"
        name="number"
        placeholder="12.34"
        defaultValue={initialNumberValue}
        error={numberError}
        required
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              number: value,
            },
            ""
          );
        }}
      />
      <NumberInput
        label="Tolerance"
        name="tolerance"
        placeholder="0.015 (optional)"
        defaultValue={initialTolerance}
        error={toleranceError}
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              tolerance: value,
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
