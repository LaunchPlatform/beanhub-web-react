import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
import FormRow from "./FormRow";
import { v4 as uuid } from "uuid";
import ThemeContext from "../Theme/context";

const controls = {
  leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
  rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>',
};

export interface Props {
  readonly name?: string;
  readonly label?: string;
  readonly defaultValue?: string;
  readonly placeholder?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly onChange?: (value: string) => void;
}

const WrapInputGroupAppend: FunctionComponent<
  PropsWithChildren<{
    wrap: boolean;
  }>
> = ({ wrap, children }) =>
  wrap ? <div className="input-group-append">{children}</div> : <>{children}</>;

const DateInput: FunctionComponent<Props> = ({
  name,
  label,
  defaultValue,
  error,
  required,
  placeholder,
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
  const theme = useContext(ThemeContext);
  return (
    <FormRow title={label ?? "Date"} required={required}>
      <div className="input-group">
        <input
          type="text"
          className={
            "form-control" + (error !== undefined ? " is-invalid" : "")
          }
          id={dateId}
          name={name ?? "date"}
          defaultValue={defaultValue}
          placeholder={placeholder ?? "Date of transaction"}
          onChange={(event) => onChange?.(event.target.value)}
        />
        <WrapInputGroupAppend wrap={!theme.originalBs5InputAppend}>
          <span className="input-group-text fs-xl">
            <i className={`${theme.iconPrefix} ${theme.calendarIcon}`}></i>
          </span>
        </WrapInputGroupAppend>
        {error !== undefined ? (
          <div className="invalid-feedback">{error}</div>
        ) : null}
      </div>
    </FormRow>
  );
};

export default DateInput;
