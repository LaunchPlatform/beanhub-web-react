import React, { FunctionComponent } from "react";
import Select, { GroupBase, Props as SelectProps } from "react-select";
import CreatableSelect from "react-select/creatable";
import FormRow from "./FormRow";
import { fuzzyMatch } from "../TransactionForm/fuzzyMatch";

export interface Props {
  readonly title: string;
  readonly name: string;
  readonly values: Array<string>;
  readonly initialValue?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly creatable?: boolean;
  readonly onChange?: (value: string) => void;
}

interface Option {
  readonly value: string;
  readonly label: string;
}

function CustomSelect<
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

const SelectionInput: FunctionComponent<Props> = ({
  values,
  initialValue,
  title,
  name,
  error,
  required,
  creatable,
  onChange,
}: Props) => {
  const borderColor = error !== undefined ? "#fd3995" : "#E5E5E5";
  return (
    <FormRow title={title} required={required}>
      <CustomSelect
        name={name}
        creatable={creatable}
        className={error !== undefined ? "is-invalid" : ""}
        filterOption={(options, keyword) => {
          if (keyword.trim().length === 0) {
            return true;
          }
          const matchedPieces = fuzzyMatch(options.value, keyword);
          return matchedPieces !== null;
        }}
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
        options={values.map((value) => ({ value, label: value }))}
        defaultValue={
          initialValue !== undefined
            ? { value: initialValue, label: initialValue }
            : undefined
        }
        onChange={(option) => {
          onChange?.((option as any).value);
        }}
      />
      {error !== undefined ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
    </FormRow>
  );
};
export default SelectionInput;
