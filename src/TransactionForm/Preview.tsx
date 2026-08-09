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
        // Override Bootstrap .form-control's fixed single-line height so
        // the preview grows with its content instead of scrolling inside.
        height: "auto",
        whiteSpace: "pre",
        fontFamily:
          "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontSize: "0.875rem",
        backgroundColor: "#f8f9fa",
        marginBottom: 0,
        padding: "0.5rem 0.75rem",
        overflowX: "auto",
        overflowY: "visible",
      }}
    >
      {source || " "}
    </pre>
  </FormRow>
);

export default Preview;
