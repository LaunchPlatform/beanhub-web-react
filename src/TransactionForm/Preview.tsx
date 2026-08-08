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
        whiteSpace: "pre",
        fontFamily:
          "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontSize: "0.875rem",
        backgroundColor: "#f8f9fa",
        marginBottom: 0,
        padding: "0.5rem 0.75rem",
      }}
    >
      {source || " "}
    </pre>
  </FormRow>
);

export default Preview;
