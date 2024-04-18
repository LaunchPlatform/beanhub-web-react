import React, { FunctionComponent } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
import Selection from "../Shared/Selection";
import TextInput from "../Shared/TextInput";
import SubmitButton from "../Shared/SubmitButton";
import CurrencyInput from "../Shared/CurrencyInput";
import NumberInput from "../Shared/NumberInput";

export enum FieldType {
  str = "str",
  number = "number",
  file = "file",
  date = "date",
  currency = "currency",
  account = "account",
}

export interface BaseField {
  readonly name: string;
  readonly required?: boolean;
  readonly displayName?: string;
  readonly placeholder?: string;
  readonly error?: string;
}

export interface OtherField extends BaseField {
  readonly type: Exclude<
    FieldType,
    FieldType.file | FieldType.currency | FieldType.account
  >;
  readonly default?: string;
}

export interface CurrencyField extends BaseField {
  readonly type: FieldType.currency;
  readonly multiple?: boolean;
  readonly creatable?: boolean;
  readonly default?: string | Array<string>;
}

export interface FileField extends BaseField {
  readonly type: FieldType.file;
  readonly creatable?: boolean;
  readonly default?: string;
}

export interface AccountField extends BaseField {
  readonly type: FieldType.account;
  readonly creatable?: boolean;
  readonly default?: string;
}

export type Field = OtherField | CurrencyField | FileField | AccountField;

export interface Props {
  readonly action?: string;
  readonly method?: string;
  readonly fields: Array<Field>;
  readonly hiddenFields?: Record<string, string>;
  readonly files: Array<string>;
  readonly currencies: Array<string>;
  readonly accounts: Array<string>;
  readonly defaultDate: string;
  readonly errors?: Array<string>;
  readonly submit?: string;
}

interface FieldProps {
  readonly field: Field;
  readonly files: Array<string>;
  readonly currencies: Array<string>;
  readonly accounts: Array<string>;
  readonly defaultDate: string;
}

const FormField: FunctionComponent<FieldProps> = ({
  field,
  currencies,
  files,
  accounts,
  defaultDate,
}: FieldProps) => {
  let initialValue = field.default;
  if (window.history.state?.[field.name] !== undefined) {
    initialValue = window.history.state?.[field.name];
  }
  const displayName = field.displayName ?? field.name;
  const placeholder = field.placeholder ?? displayName;
  switch (field.type) {
    case FieldType.str:
      return (
        <TextInput
          label={displayName}
          name={field.name}
          placeholder={placeholder}
          defaultValue={initialValue as string}
          error={field.error}
          required={field.required}
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
    case FieldType.number:
      return (
        <NumberInput
          label={displayName}
          name={field.name}
          placeholder={placeholder}
          defaultValue={initialValue as string}
          error={field.error}
          required={field.required}
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
      if (initialValue === undefined) {
        initialValue = defaultDate;
      }
      return (
        <DateInput
          label={displayName}
          name={field.name}
          placeholder={placeholder}
          defaultValue={initialValue as string}
          error={field.error}
          required={field.required}
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
          required={field.required}
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
          required={field.required}
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
    case FieldType.account:
      return (
        <Selection
          title={displayName}
          name={field.name}
          values={accounts}
          initialValue={initialValue as string}
          error={field.error}
          required={field.required}
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
  defaultDate,
  errors,
  submit,
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
          defaultDate={defaultDate}
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
      <SubmitButton title={submit ?? "Submit"} />
    </form>
  );
};
export default Form;
