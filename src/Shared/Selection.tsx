import React, { FunctionComponent } from "react";
import Select, { GroupBase, Props as SelectProps } from "react-select";
import CreatableSelect from "react-select/creatable";
import FormRow from "./FormRow";
import { reactSelectFieldStyles } from "./selectFieldStyles";
import { useDarkSkin } from "../Theme/darkSkin";
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
  const dark = useDarkSkin();
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
        styles={reactSelectFieldStyles(dark, error)}
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
