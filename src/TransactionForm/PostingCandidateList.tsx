import React, { CSSProperties, FunctionComponent } from "react";
import PostingCandidate from "./PostingCandidate";

export interface Candidate {
  readonly prefix: string;
  readonly suffix: string;
  readonly account: string;
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
        key={candidate.account}
        prefix={candidate.prefix}
        suffix={candidate.suffix}
        active={index === activeIndex}
        onClick={() => onClick?.(candidate.account)}
      />
    ))}
  </div>
);

export default PostingCandidateList;
