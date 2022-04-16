import React, { FunctionComponent } from "react";
import Select, { GroupBase, Props as SelectProps } from "react-select";
import FormRow from "./FormRow";

export interface Props {
  readonly files: Array<string>;
  readonly initialFile?: string;
  readonly error?: string;
  readonly onChange?: (value: string) => void;
}

interface Option {
  readonly value: string;
  readonly label: string;
}

function CustomSelect<
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: SelectProps<Option, IsMulti, Group>) {
  return (
    <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
  );
}

const FileInput: FunctionComponent<Props> = ({
  files,
  initialFile,
  error,
  onChange,
}: Props) => {
  const borderColor = error !== undefined ? "#fd3995" : "#E5E5E5";
  return (
    <FormRow title="File" required>
      <CustomSelect
        name="file"
        className={error !== undefined ? "is-invalid" : ""}
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
        options={files.map((file) => ({ value: file, label: file }))}
        defaultValue={
          initialFile !== undefined
            ? { value: initialFile, label: initialFile }
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
export default FileInput;