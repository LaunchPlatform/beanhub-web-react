import { FunctionComponent } from "react";
import { FormMode } from "./formMode";

export interface Props {
  readonly mode: FormMode;
  readonly onChange: (mode: FormMode) => void;
}

const ModeToggle: FunctionComponent<Props> = ({ mode, onChange }: Props) => (
  <div className="form-group row">
    <div className="col-12 col-lg-11 offset-lg-1">
      <div
        className="btn-group btn-group-sm"
        role="group"
        aria-label="Form mode"
      >
        <button
          type="button"
          className={
            "btn " + (mode === "simple" ? "btn-primary" : "btn-outline-primary")
          }
          onClick={() => onChange("simple")}
        >
          Simple
        </button>
        <button
          type="button"
          className={
            "btn " +
            (mode === "advanced" ? "btn-primary" : "btn-outline-primary")
          }
          onClick={() => onChange("advanced")}
        >
          Advanced
        </button>
      </div>
      <small className="text-muted ml-2">
        {mode === "simple"
          ? "Common fields only"
          : "Flag, tags, links, costs, and posting details"}
      </small>
    </div>
  </div>
);

export default ModeToggle;
