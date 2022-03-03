import React, { FunctionComponent, useEffect, useState } from "react";
import FormRow from "./FormRow";
import { v4 as uuid } from "uuid";
import Select, { GroupBase, Props as SelectProps } from "react-select";

export interface Props {
  readonly files: Array<string>;
  readonly initialFile?: string;
  readonly error?: string;
  readonly onChange?: () => void;
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
        }}
        options={files.map((file) => ({ value: file, label: file }))}
        defaultValue={
          initialFile !== undefined
            ? { value: initialFile, label: initialFile }
            : undefined
        }
        onChange={onChange}
      />
      {error !== undefined ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
    </FormRow>
  );
};
export default FileInput;
