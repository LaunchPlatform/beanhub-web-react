import React, { FunctionComponent } from "react";
import PostingCandidate from "./PostingCandidate";

export interface Candidate {
  readonly prefix: string;
  readonly suffix: string;
  readonly account: string;
}

export interface Props {
  readonly candidates: Array<Candidate>;
  readonly onClick?: (account: string) => void;
}

const PostingCandidateList: FunctionComponent<Props> = ({
  candidates,
  onClick,
}: Props) => {
  console.log("!!!!!!!!!!!@@@@@@@@", candidates);
  return (
    <div className="list-group">
      {candidates.map((candidate) => (
        <PostingCandidate
          key={candidate.account}
          prefix={candidate.prefix}
          suffix={candidate.suffix}
          onClick={() => onClick?.(candidate.account)}
        />
      ))}
    </div>
  );
};

export default PostingCandidateList;
