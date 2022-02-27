import React, { FunctionComponent, useEffect } from "react";
import FormRow from "./FormRow";

export interface Props {
  readonly defaultValue?: string;
}

const NarrationInput: FunctionComponent<Props> = ({ defaultValue }: Props) => (
  <FormRow title="Narration" required>
    <input
      type="text"
      className="form-control"
      placeholder="Narration of the transaction"
      name="narration"
      defaultValue={defaultValue}
    />
  </FormRow>
);
export default NarrationInput;
