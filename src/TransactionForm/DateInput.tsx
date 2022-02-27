import React, { FunctionComponent, useEffect } from "react";

const controls = {
  leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
  rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>',
};

export interface Props {
  readonly today: string;
}

const DateInput: FunctionComponent<Props> = ({ today }: Props) => {
  useEffect(() => {
    $("#datepicker").datepicker({
      format: "yyyy-mm-dd",
      todayHighlight: true,
      orientation: "bottom left",
      templates: controls,
    });
  }, []);
  return (
    <div className="form-group row">
      <label className="col-form-label col-12 col-lg-1 form-label text-lg-right">
        Date
        <strong style={{ color: "red" }}>*</strong>
      </label>
      <div className="col-12 col-lg-11">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="datepicker"
            name="date"
            defaultValue={today}
            placeholder="Date of transaction"
          />
          <div className="input-group-append">
            <span className="input-group-text fs-xl">
              <i className="fal fa-calendar-alt"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateInput;
