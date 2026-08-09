import React, { FunctionComponent, CSSProperties, ReactNode } from "react";
import FormRow from "./FormRow";
import { computeLineDiff, DiffLine, DiffSegment } from "./diff";

export interface Props {
  readonly original?: string;
  readonly updated: string;
}

const lineStyle = (type: DiffLine["type"]): CSSProperties => {
  switch (type) {
    case "add":
      return { backgroundColor: "#e6ffed", color: "#22863a" };
    case "remove":
      return { backgroundColor: "#ffeef0", color: "#b31d28" };
    default:
      return {};
  }
};

const prefix = (type: DiffLine["type"]): string => {
  switch (type) {
    case "add":
      return "+ ";
    case "remove":
      return "- ";
    default:
      return "  ";
  }
};

const segmentStyle = (
  type: DiffLine["type"],
  changed: boolean
): CSSProperties | undefined => {
  if (!changed || type === "same") {
    return undefined;
  }
  // Stronger mark for the changed chars inside an already tinted line.
  return {
    backgroundColor: type === "add" ? "#acf2bd" : "#fdb8c0",
    borderRadius: 2,
  };
};

const renderSegments = (
  type: DiffLine["type"],
  segments: Array<DiffSegment> | undefined,
  text: string
): ReactNode => {
  if (!segments || segments.length === 0) {
    return text || " ";
  }
  return segments.map((segment, index) => (
    <span key={index} style={segmentStyle(type, segment.changed)}>
      {segment.text}
    </span>
  ));
};

const DiffPreview: FunctionComponent<Props> = ({
  original,
  updated,
}: Props) => {
  const hasOriginal = (original ?? "").trim().length > 0;
  const lines: Array<DiffLine> = hasOriginal
    ? computeLineDiff(original ?? "", updated)
    : updated.split("\n").map((text) => ({ type: "same" as const, text }));

  return (
    <FormRow title={hasOriginal ? "Diff" : "Preview"}>
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
        {lines.map((line, index) => (
          <div
            key={`${line.type}-${index}-${line.text}`}
            style={{
              ...lineStyle(line.type),
              marginLeft: hasOriginal ? "-0.75rem" : undefined,
              marginRight: hasOriginal ? "-0.75rem" : undefined,
              paddingLeft: hasOriginal ? "0.75rem" : undefined,
              paddingRight: hasOriginal ? "0.75rem" : undefined,
            }}
          >
            {hasOriginal ? prefix(line.type) : null}
            {renderSegments(line.type, line.segments, line.text)}
          </div>
        ))}
      </pre>
      {hasOriginal ? (
        <small className="form-text text-muted">
          Green lines are additions; red lines are removals compared to the
          original entry. Darker marks highlight changed characters.
        </small>
      ) : null}
    </FormRow>
  );
};

export default DiffPreview;
