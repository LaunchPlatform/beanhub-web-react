import React, { FunctionComponent, CSSProperties, ReactNode } from "react";
import FormRow from "./FormRow";
import { diffColors } from "./diffColors";
import { computeLineDiff, DiffLine, DiffSegment } from "./diff";
import { useDarkSkin } from "../Theme/darkSkin";

export interface Props {
  readonly original?: string;
  readonly updated: string;
}

const lineStyle = (
  type: DiffLine["type"],
  colors: ReturnType<typeof diffColors>
): CSSProperties => {
  switch (type) {
    case "add":
      return { backgroundColor: colors.addBg, color: colors.addText };
    case "remove":
      return { backgroundColor: colors.removeBg, color: colors.removeText };
    default:
      return { color: colors.text };
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
  changed: boolean,
  colors: ReturnType<typeof diffColors>
): CSSProperties | undefined => {
  if (!changed || type === "same") {
    return undefined;
  }
  // Stronger mark for the changed chars inside an already tinted line.
  return {
    backgroundColor: type === "add" ? colors.addMark : colors.removeMark,
    borderRadius: 2,
  };
};

const renderSegments = (
  type: DiffLine["type"],
  segments: Array<DiffSegment> | undefined,
  text: string,
  colors: ReturnType<typeof diffColors>
): ReactNode => {
  if (!segments || segments.length === 0) {
    return text || " ";
  }
  return segments.map((segment, index) => (
    <span key={index} style={segmentStyle(type, segment.changed, colors)}>
      {segment.text}
    </span>
  ));
};

const DiffPreview: FunctionComponent<Props> = ({
  original,
  updated,
}: Props) => {
  const colors = diffColors(useDarkSkin());
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
          // Inline, so dark-mode `pre` / `.form-control { color: #fff }` cannot
          // paint white text onto a light surface (or the reverse).
          color: colors.text,
          backgroundColor: colors.surface,
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
              ...lineStyle(line.type, colors),
              marginLeft: hasOriginal ? "-0.75rem" : undefined,
              marginRight: hasOriginal ? "-0.75rem" : undefined,
              paddingLeft: hasOriginal ? "0.75rem" : undefined,
              paddingRight: hasOriginal ? "0.75rem" : undefined,
            }}
          >
            {hasOriginal ? prefix(line.type) : null}
            {renderSegments(line.type, line.segments, line.text, colors)}
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
