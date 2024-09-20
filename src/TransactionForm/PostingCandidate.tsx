import React, { FunctionComponent } from "react";
import { MatchedText } from "./PostingCandidateList";

export interface Props {
  readonly matchedPieces: Array<MatchedText>;
  readonly active?: boolean;
  readonly first?: boolean;
  readonly onClick?: () => void;
}

const PostingCandidate: FunctionComponent<Props> = ({
  matchedPieces,
  active,
  first,
  onClick,
}: Props) => (
  <a
    className={`list-group-item list-group-item-action${
      active ?? false ? " active" : ""
    }`}
    href="/"
    onMouseDown={(event) => {
      // We need to prevent mouse down triggering blur for
      // the account input first, so that click gets a call first
      // ref: https://stackoverflow.com/a/57630197
      event.preventDefault();
    }}
    onClick={(event) => {
      onClick?.();
      event.preventDefault();
    }}
    style={{
      ...(first ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : {}),
    }}
  >
    {matchedPieces.map((piece) =>
      piece.matched ? <strong>{piece.text}</strong> : piece.text
    )}
  </a>
);

export default PostingCandidate;
