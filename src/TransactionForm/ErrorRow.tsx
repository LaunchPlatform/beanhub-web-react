import React, { FunctionComponent, PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  readonly message: string;
}>;

const ErrorRow: FunctionComponent<Props> = ({ message }: Props) => (
  <div className="form-group row">
    <div className="col-12 offset-lg-1 col-lg-11 is-invalid">
      <div className="invalid-feedback">{message}</div>
    </div>
  </div>
);
export default ErrorRow;
