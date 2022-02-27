import React, { FunctionComponent } from "react";

export interface Props {
  readonly prefix: string;
  readonly suffix: string;
  readonly active?: boolean;
  readonly onClick?: () => void;
}

const PostingCandidate: FunctionComponent<Props> = ({
  prefix,
  suffix,
  active,
  onClick,
}: Props) => (
  <a
    className={`list-group-item list-group-item-action${
      active ?? false ? " active" : ""
    }`}
    href="#"
    onClick={(event) => {
      onClick?.();
      event.preventDefault();
    }}
  >
    <strong>{prefix}</strong>
    {suffix}
  </a>
);

export default PostingCandidate;
