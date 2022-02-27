import React, { FunctionComponent, useEffect, PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  readonly title: string;
  readonly required?: boolean;
}>;

const FormRow: FunctionComponent<Props> = ({
  title,
  required,
  children,
}: Props) => (
  <div className="form-group row">
    <label className="col-form-label col-12 col-lg-1 form-label text-lg-right">
      {title}
      {required ?? false ? <strong style={{ color: "red" }}>*</strong> : null}
    </label>
    <div className="col-12 col-lg-11">{children}</div>
  </div>
);
export default FormRow;
