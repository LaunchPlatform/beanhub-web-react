import React, { FunctionComponent } from "react";
import FormRow from "./FormRow";

export interface Props {
  readonly label: string;
  readonly defaultValue?: string;
  readonly error?: string;
  readonly name?: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly integer?: boolean;
  readonly onChange?: (value: string) => void;
}

const NumberInput: FunctionComponent<Props> = ({
  defaultValue,
  error,
  label,
  name,
  placeholder,
  required,
  integer,
  onChange,
}: Props) => (
  <FormRow title={label} required={required ?? false}>
    <div className="input-group">
      <input
        type="number"
        step={integer ?? false ? "1" : undefined}
        className={"form-control" + (error !== undefined ? " is-invalid" : "")}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {error !== undefined ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
    </div>
  </FormRow>
);
export default NumberInput;
