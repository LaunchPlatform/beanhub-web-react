import React, { FunctionComponent } from "react";
import FormRow from "./FormRow";

export interface Props {
  readonly label: string;
  readonly defaultValue?: string;
  readonly error?: string;
  readonly name?: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly onChange?: (value: string) => void;
}

const TextInput: FunctionComponent<Props> = ({
  defaultValue,
  error,
  label,
  name,
  placeholder,
  required,
  onChange,
}: Props) => (
  <FormRow title={label} required={required ?? false}>
    <div className="input-group">
      <input
        type="text"
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
export default TextInput;
