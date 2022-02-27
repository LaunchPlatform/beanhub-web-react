import React, { FunctionComponent, useEffect } from "react";
import FormRow from "./FormRow";

const controls = {
  leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
  rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>',
};

export interface Props {
  readonly defaultValue?: string;
}

const DateInput: FunctionComponent<Props> = ({ defaultValue }: Props) => {
  useEffect(() => {
    $("#datepicker").datepicker({
      format: "yyyy-mm-dd",
      todayHighlight: true,
      orientation: "bottom left",
      templates: controls,
    });
  }, []);
  return (
    <FormRow title="Date" required>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          id="datepicker"
          name="date"
          defaultValue={defaultValue}
          placeholder="Date of transaction"
        />
        <div className="input-group-append">
          <span className="input-group-text fs-xl">
            <i className="fal fa-calendar-alt"></i>
          </span>
        </div>
      </div>
    </FormRow>
  );
};

export default DateInput;
