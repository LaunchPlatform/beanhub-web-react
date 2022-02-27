import React, { FunctionComponent, useEffect } from "react";

export interface Props {
  readonly defaultValue?: string;
}

const NarrationInput: FunctionComponent<Props> = ({ defaultValue }: Props) => {
  return (
    <div className="form-group row">
      <label className="col-form-label col-12 col-lg-1 form-label text-lg-right">
        Narration
        <strong style={{ color: "red" }}>*</strong>
      </label>
      <div className="col-12 col-lg-11">
        <input
          type="text"
          className="form-control"
          placeholder="Narration of the transaction"
          name="narration"
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
};

export default NarrationInput;
