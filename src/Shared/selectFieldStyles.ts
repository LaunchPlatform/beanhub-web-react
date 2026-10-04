import { GroupBase, StylesConfig } from "react-select";

const FOCUS_BORDER = "#886ab5";
const ERROR_BORDER = "#fd3995";
const DARK_FIELD_BG = "#202225";
const DARK_MENU_BG = "#383b40";
const DARK_HOVER_BG = "#3e4146";
const DARK_TEXT = "#ffffff";
const DARK_MUTED = "#a5abb1";
const DARK_BORDER = "rgba(0, 0, 0, 0.35)";

export function reactSelectFieldStyles<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(dark: boolean, error?: string): StylesConfig<Option, IsMulti, Group> {
  const borderColor =
    error !== undefined ? ERROR_BORDER : dark ? DARK_BORDER : "#E5E5E5";
  return {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? FOCUS_BORDER
        : dark
        ? state.isFocused
          ? DARK_HOVER_BG
          : DARK_MENU_BG
        : state.isFocused
        ? "#eeeeee"
        : "white",
      color: state.isSelected || dark ? DARK_TEXT : provided.color,
      cursor: "pointer",
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: dark ? DARK_FIELD_BG : provided.backgroundColor,
      borderRadius: "4px",
      borderWidth: "1px",
      borderColor:
        state.isFocused && error === undefined ? FOCUS_BORDER : borderColor,
      boxShadow:
        state.isFocused && error !== undefined
          ? "0 0 0 0.2rem rgba(253, 57, 149, 0.25)"
          : undefined,
      "&:hover": undefined,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: dark ? DARK_TEXT : provided.color,
    }),
    input: (provided) => ({
      ...provided,
      color: dark ? DARK_TEXT : provided.color,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: dark ? DARK_MUTED : provided.color,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: dark ? DARK_MUTED : provided.color,
      ":hover": {
        color: dark ? DARK_TEXT : provided.color,
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: dark ? DARK_MUTED : provided.color,
      ":hover": {
        color: dark ? DARK_TEXT : provided.color,
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: dark
        ? "rgba(255, 255, 255, 0.15)"
        : provided.backgroundColor,
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: dark ? DARK_MENU_BG : provided.backgroundColor,
      zIndex: 5,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: dark ? "#3a3154" : provided.backgroundColor,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: dark ? "#e6def4" : provided.color,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: dark ? "#e6def4" : provided.color,
      ":hover": {
        backgroundColor: dark ? "#4b3d6a" : provided.backgroundColor,
        color: dark ? DARK_TEXT : provided.color,
      },
    }),
  };
}
