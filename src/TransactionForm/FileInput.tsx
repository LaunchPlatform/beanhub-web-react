import React, { FunctionComponent, useEffect } from "react";

export interface Props {
  readonly files: Array<string>;
}

const FileInput: FunctionComponent<Props> = ({ files }: Props) => {
  useEffect(() => {
    $(".select2").select2();
  }, []);
  return (
    <div className="form-group row">
      <label className="col-form-label col-12 col-lg-1 form-label text-lg-right">
        File
        <strong style={{ color: "red" }}>*</strong>
      </label>
      <div className="col-12 col-lg-11">
        <select className="select2 form-control w-100" name="file">
          {files.map((filename) => (
            <option value={filename} key={filename}>
              {filename}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FileInput;
