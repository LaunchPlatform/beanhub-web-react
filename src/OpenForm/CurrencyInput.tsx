import React, { FunctionComponent } from "react";
import { GroupBase, Props as SelectProps } from "react-select";
import CreatableSelect from "react-select/creatable";
import FormRow from "../Shared/FormRow";

export interface Props {
  readonly currencies: Array<string>;
  readonly initialValues?: Array<string>;
  readonly error?: string;
  readonly required?: boolean;
  readonly onChange?: (value: string) => void;
}

interface Option {
  readonly value: string;
  readonly label: string;
}

function CustomSelect<
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: SelectProps<Option, IsMulti, Group>) {
  return (
    <CreatableSelect
      {...props}
      theme={(theme) => ({ ...theme, borderRadius: 0 })}
    />
  );
}

const CurrencyInput: FunctionComponent<Props> = ({
  currencies,
  initialValues,
  error,
  required,
  onChange,
}: Props) => {
  const borderColor = error !== undefined ? "#fd3995" : "#E5E5E5";
  return (
    <FormRow title="Currencies" required={required}>
      <CustomSelect
        name="currency"
        className={error !== undefined ? "is-invalid" : ""}
        isMulti
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
        defaultValue={
          initialValues !== undefined
            ? initialValues.map((value) => ({ value, label: value }))
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
export default CurrencyInput;
