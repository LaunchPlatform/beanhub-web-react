import React, { FunctionComponent, useEffect } from "react";
import FormRow from "./FormRow";

export interface Props {
  readonly files: Array<string>;
}

const FileInput: FunctionComponent<Props> = ({ files }: Props) => {
  useEffect(() => {
    $(".select2").select2();
  }, []);
  return (
    <FormRow title="File" required>
      <select className="select2 form-control w-100" name="file">
        {files.map((filename) => (
          <option value={filename} key={filename}>
            {filename}
          </option>
        ))}
      </select>
    </FormRow>
  );
};
export default FileInput;
