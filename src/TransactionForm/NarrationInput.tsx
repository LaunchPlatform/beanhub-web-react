import React, { FunctionComponent } from "react";
import FormRow from "./FormRow";

export interface Props {
  readonly defaultValue?: string;
  readonly error?: string;
  readonly onChange?: (value: string) => void;
}

const NarrationInput: FunctionComponent<Props> = ({
  defaultValue,
  error,
  onChange,
}: Props) => (
  <FormRow title="Narration" required>
    <div className="input-group">
      <input
        type="text"
        className={"form-control" + (error !== undefined ? " is-invalid" : "")}
        placeholder="Narration of the transaction"
        name="narration"
        defaultValue={defaultValue}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {error !== undefined ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
    </div>
  </FormRow>
);
export default NarrationInput;
