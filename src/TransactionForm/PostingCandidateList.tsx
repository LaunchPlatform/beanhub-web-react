import React, { CSSProperties, FunctionComponent } from "react";
import PostingCandidate from "./PostingCandidate";

export interface MatchedText {
  readonly text: string;
  readonly matched: boolean;
}

export interface Candidate {
  readonly value: string;
  readonly matchedPieces: Array<MatchedText>;
}

export interface Props {
  readonly style?: CSSProperties;
  readonly candidates: Array<Candidate>;
  readonly activeIndex: number;
  readonly onClick?: (account: string) => void;
}

const PostingCandidateList: FunctionComponent<Props> = ({
  candidates,
  activeIndex,
  style,
  onClick,
}: Props) => (
  <div className="list-group" style={style}>
    {candidates.map((candidate, index) => (
      <PostingCandidate
        key={candidate.value}
        matchedPieces={candidate.matchedPieces}
        active={index === activeIndex}
        first={index === 0}
        onClick={() => onClick?.(candidate.value)}
      />
    ))}
  </div>
);

export default PostingCandidateList;
