import React, { FunctionComponent, PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  readonly title: string;
}>;

const HeaderLine: FunctionComponent<Props> = ({ title, children }: Props) => (
  <div className="row">
    <div className="col-12">{title}</div>
  </div>
);
export default HeaderLine;
