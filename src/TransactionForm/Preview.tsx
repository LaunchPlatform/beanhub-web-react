import { FunctionComponent } from "react";
import FormRow from "../Shared/FormRow";

export interface Props {
  readonly source: string;
}

const Preview: FunctionComponent<Props> = ({ source }: Props) => (
  <FormRow title="Preview">
    <pre
      className="form-control"
      style={{
        minHeight: "8rem",
        whiteSpace: "pre-wrap",
        fontFamily:
          "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontSize: "0.875rem",
        backgroundColor: "#f8f9fa",
        marginBottom: 0,
      }}
    >
      {source || " "}
    </pre>
  </FormRow>
);

export default Preview;
