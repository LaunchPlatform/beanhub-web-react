import React, { FunctionComponent, PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  readonly title: string;
  readonly href?: string;
}>;

const HeaderLine: FunctionComponent<Props> = ({ title, href }: Props) => (
  <div className="panel-tag">
    {href !== undefined ? <a href={href}>{title}</a> : title}
  </div>
);
export default HeaderLine;
