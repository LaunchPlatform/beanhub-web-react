import React, { FunctionComponent } from "react";

export interface Props {
  readonly title?: string;
}

const SubmitButton: FunctionComponent<Props> = ({ title }: Props) => (
  <div className="form-group row">
    <div className="col-12 offset-lg-1 col-lg-11">
      <button type="submit" className="btn btn-primary">
        {title ?? "Submit"}
      </button>
    </div>
  </div>
);
export default SubmitButton;
