import React, { FunctionComponent, useEffect, useState } from "react";
import FormRow from "./FormRow";
import { v4 as uuid } from "uuid";
import Select, { GroupBase, Props as SelectProps } from "react-select";

export interface Props {
  readonly files: Array<string>;
  readonly initialFile?: string;
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
  onChange,
}: Props) => {
  return (
    <FormRow title="File" required>
      <CustomSelect
        name="file"
        styles={{
          option: (provided, state) => ({
            ...provided,
            "&:hover": {
              backgroundColor: "#eeeeee",
            },
            backgroundColor: state.isSelected ? "#886ab5" : "white",
          }),
          control: (provided, state) => ({
            ...provided,
            borderRadius: "4px",
            borderWidth: "1px",
            borderColor: state.isFocused ? "#886ab5" : "#E5E5E5",
            boxShadow: undefined,
            "&:hover": undefined,
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
    </FormRow>
  );
};
export default FileInput;
