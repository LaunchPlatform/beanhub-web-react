import React, { FunctionComponent, PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  readonly title: string;
}>;

const HeaderLine: FunctionComponent<Props> = ({ title, children }: Props) => (
  <div className="panel-tag">{title}</div>
);
export default HeaderLine;
