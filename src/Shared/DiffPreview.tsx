import React, { FunctionComponent, CSSProperties } from "react";
import { computeLineDiff, DiffLine } from "./diff";

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

const DiffPreview: FunctionComponent<Props> = ({
  original,
  updated,
}: Props) => {
  const hasOriginal = (original ?? "").trim().length > 0;
  const lines = hasOriginal
    ? computeLineDiff(original ?? "", updated)
    : updated.split("\n").map((text) => ({ type: "same" as const, text }));

  return (
    <div className="form-group">
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
          overflow: "auto",
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
            {line.text || " "}
          </div>
        ))}
      </pre>
      {hasOriginal ? (
        <small className="form-text text-muted">
          Green lines are additions; red lines are removals compared to the
          original entry.
        </small>
      ) : null}
    </div>
  );
};

export default DiffPreview;
