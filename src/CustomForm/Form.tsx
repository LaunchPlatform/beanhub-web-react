import React, { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
import TextInput from "../Shared/TextInput";
import SubmitButton from "../Shared/SubmitButton";
import CurrencyInput from "../Shared/CurrencyInput";

export enum FieldType {
  str = "str",
  int = "int",
  file = "file",
  date = "date",
  currency = "currency",
  account = "account",
}

export interface BaseField {
  readonly name: string;
  readonly required?: boolean;
  readonly displayName?: string;
  readonly error?: string;
}

export interface OtherField extends BaseField {
  readonly type: Exclude<FieldType, FieldType.currency>;
  readonly default?: string;
}

export interface CurrencyField extends BaseField {
  readonly type: FieldType.currency;
  readonly multiple?: boolean;
  readonly creatable?: boolean;
  readonly default?: string | Array<string>;
}

export type Field = OtherField | CurrencyField;

export interface Props {
  readonly action?: string;
  readonly method?: string;
  readonly fields: Array<Field>;
  readonly hiddenFields?: Record<string, string>;
  readonly files: Array<string>;
  readonly currencies: Array<string>;
  readonly accounts: Array<string>;
  readonly errors?: Array<string>;
}

interface FieldProps {
  readonly field: Field;
  readonly files: Array<string>;
  readonly currencies: Array<string>;
  readonly accounts: Array<string>;
}

const FormField: FunctionComponent<FieldProps> = ({
  field,
  currencies,
  files,
}: FieldProps) => {
  let initialValue = field.default;
  if (window.history.state?.[field.name] !== undefined) {
    initialValue = window.history.state?.[field.name];
  }
  const displayName = field.displayName ?? field.name;
  switch (field.type) {
    case FieldType.str:
    case FieldType.int:
      return (
        <TextInput
          label={displayName}
          name={field.name}
          placeholder={displayName}
          defaultValue={initialValue as string}
          error={field.error}
          onChange={(value) => {
            window.history.replaceState(
              {
                ...window.history.state,
                [field.name]: value,
              },
              ""
            );
          }}
        />
      );
    case FieldType.date:
      return (
        <DateInput
          label={displayName}
          name={field.name}
          placeholder={displayName}
          defaultValue={initialValue as string}
          error={field.error}
          onChange={(value) => {
            window.history.replaceState(
              {
                ...window.history.state,
                [field.name]: value,
              },
              ""
            );
          }}
        />
      );
    case FieldType.currency:
      return (
        <CurrencyInput
          label={displayName}
          name={field.name}
          currencies={currencies}
          initialValue={initialValue}
          error={field.error}
          multiple={field.multiple}
          creatable={field.creatable}
          onChange={(value) => {
            window.history.replaceState(
              {
                ...window.history.state,
                [field.name]: value,
              },
              ""
            );
          }}
        />
      );
    case FieldType.file:
      return (
        <SelectionInput
          title={displayName}
          name={field.name}
          values={files}
          initialValue={initialValue as string}
          error={field.error}
          onChange={(value) => {
            window.history.replaceState(
              {
                ...window.history.state,
                [field.name]: value,
              },
              ""
            );
          }}
        />
      );
    case FieldType.account:
      return null;
  }
};

const Form: FunctionComponent<Props> = ({
  action,
  method,
  fields,
  hiddenFields,
  files,
  currencies,
  accounts,
  errors,
}: Props) => {
  return (
    <form action={action} method={method ?? "POST"}>
      {fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          currencies={currencies}
          files={files}
          accounts={accounts}
        />
      ))}
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
