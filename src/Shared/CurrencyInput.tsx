import React, { FunctionComponent } from "react";
import Select, { GroupBase, Props as SelectProps } from "react-select";
import CreatableSelect from "react-select/creatable";
import FormRow from "./FormRow";

export interface Props {
  readonly name?: string;
  readonly label?: string;
  readonly currencies: Array<string>;
  readonly initialValue?: string | Array<string>;
  readonly error?: string;
  readonly required?: boolean;
  readonly multiple?: boolean;
  readonly creatable?: boolean;
  readonly onChange?: (values: Array<string>) => void;
}

interface Option {
  readonly value: string;
  readonly label: string;
}

function MultiCustomSelect<
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: SelectProps<Option, IsMulti, Group> & { readonly creatable?: boolean }
) {
  if (props.creatable) {
    return (
      <CreatableSelect
        {...props}
        theme={(theme) => ({ ...theme, borderRadius: 0 })}
      />
    );
  }
  return (
    <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
  );
}

function SingleCustomSelect<
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: SelectProps<Option, IsMulti, Group> & { readonly creatable?: boolean }
) {
  if (props.creatable) {
    return (
      <CreatableSelect
        {...props}
        theme={(theme) => ({ ...theme, borderRadius: 0 })}
      />
    );
  }
  return (
    <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
  );
}

const CurrencyInput: FunctionComponent<Props> = ({
  name,
  label,
  currencies,
  initialValue,
  error,
  required,
  multiple,
  creatable,
  onChange,
}: Props) => {
  const borderColor = error !== undefined ? "#fd3995" : "#E5E5E5";
  const SelectComponent = multiple ? MultiCustomSelect : SingleCustomSelect;
  let defaultValue:
    | { value: string; label: string }
    | Array<{ value: string; label: string }>;
  if (multiple) {
    defaultValue =
      initialValue !== undefined
        ? initialValue.map((value) => ({ value, label: value }))
        : undefined;
  } else {
    defaultValue =
      initialValue !== undefined
        ? { value: initialValue, label: initialValue }
        : undefined;
  }
  return (
    <FormRow title={label ?? "Currencies"} required={required}>
      <SelectComponent
        name={name ?? "currency"}
        className={error !== undefined ? "is-invalid" : ""}
        isMulti={multiple}
        creatable={creatable}
        styles={{
          option: (provided, state) => ({
            ...provided,
            "&:hover": {
              backgroundColor: "#eeeeee",
              color: "black",
            },
            backgroundColor: state.isSelected ? "#886ab5" : "white",
          }),
          control: (provided, state) => ({
            ...provided,
            borderRadius: "4px",
            borderWidth: "1px",
            borderColor:
              state.isFocused && error === undefined ? "#886ab5" : borderColor,
            boxShadow: undefined,
            "&:hover": undefined,
            ...(state.isFocused && error !== undefined
              ? {
                  boxShadow: "0 0 0 0.2rem rgba(253, 57, 149, 0.25)",
                }
              : undefined),
          }),
          menu: (provided, state) => {
            return { ...provided, zIndex: 5 };
          },
        }}
        options={currencies.map((file) => ({ value: file, label: file }))}
        defaultValue={defaultValue}
        onChange={(options) => {
          onChange?.((options as Array<any>).map((option) => option.value));
        }}
      />
      {error !== undefined ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
    </FormRow>
  );
};
export default CurrencyInput;
