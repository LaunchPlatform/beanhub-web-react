import React, { FunctionComponent, useState, useEffect } from "react";
import FormRow from "./FormRow";
import { v4 as uuid } from "uuid";

const controls = {
  leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
  rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>',
};

export interface Props {
  readonly defaultValue?: string;
  readonly error?: string;
  readonly onChange?: (value: string) => void;
}

const DateInput: FunctionComponent<Props> = ({
  defaultValue,
  error,
  onChange,
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateId, _] = useState<string>(() => uuid());
  useEffect(() => {
    const datePicker = $("#" + dateId)
      .datepicker({
        format: "yyyy-mm-dd",
        todayHighlight: true,
        orientation: "bottom left",
        templates: controls,
      })
      .on("changeDate", (event: any) => {
        onChange?.(event.target.value);
      });
    return () => {
      datePicker.datepicker("destroy");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FormRow title="Date" required>
      <div className="input-group">
        <input
          type="text"
          className={
            "form-control" + (error !== undefined ? " is-invalid" : "")
          }
          id={dateId}
          name="date"
          defaultValue={defaultValue}
          placeholder="Date of transaction"
          onChange={(event) => onChange?.(event.target.value)}
        />
        <div className="input-group-append">
          <span className="input-group-text fs-xl">
            <i className="fal fa-calendar-alt"></i>
          </span>
        </div>
        {error !== undefined ? (
          <div className="invalid-feedback">{error}</div>
        ) : null}
      </div>
    </FormRow>
  );
};

export default DateInput;
