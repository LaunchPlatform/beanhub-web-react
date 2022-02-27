import React, { FunctionComponent } from "react";

export interface Props {
  readonly prefix: string;
  readonly suffix: string;
  readonly onClick?: () => void;
}

const PostingCandidate: FunctionComponent<Props> = ({
  prefix,
  suffix,
  onClick,
}: Props) => (
  <a
    className="list-group-item list-group-item-action"
    href="#"
    onClick={onClick}
  >
    <strong>{prefix}</strong>
    {suffix}
  </a>
);

export default PostingCandidate;
