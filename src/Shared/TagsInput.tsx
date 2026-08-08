import React, {
  FunctionComponent,
  KeyboardEventHandler,
  useState,
} from "react";
import CreatableSelect from "react-select/creatable";
import { OnChangeValue, StylesConfig } from "react-select";
import FormRow from "./FormRow";
import {
  formatTokenLabel,
  joinTokenList,
  normalizeToken,
  parseTokenList,
  splitRawTokenInput,
} from "./tagTokens";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface Option {
  readonly value: string;
  readonly label: string;
}

export interface Props {
  readonly label: string;
  readonly name: string;
  readonly initialValue?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly placeholder?: string;
  /** Strip a leading marker such as `#` (tags) or `^` (links). */
  readonly stripPrefix?: string;
  readonly hint?: string;
  readonly onChange?: (value: string) => void;
}

/** Chip label shows Beancount marker (# / ^); option.value stays bare for submit/edit. */
const toOptions = (
  tokens: Array<string>,
  stripPrefix?: string
): Array<Option> =>
  tokens.map((token) => ({
    value: token,
    label: formatTokenLabel(token, stripPrefix),
  }));

const TagsInput: FunctionComponent<Props> = ({
  label,
  name,
  initialValue,
  error,
  required,
  placeholder,
  stripPrefix,
  hint,
  onChange,
}: Props) => {
  const [tokens, setTokens] = useState<Array<string>>(
    parseTokenList(initialValue, stripPrefix)
  );
  const [inputValue, setInputValue] = useState("");
  const borderColor = error !== undefined ? "#fd3995" : "#E5E5E5";

  const commitTokens = (next: Array<string>) => {
    setTokens(next);
    onChange?.(joinTokenList(next));
  };

  const addFromRaw = (raw: string) => {
    const incoming = splitRawTokenInput(raw, stripPrefix);
    if (incoming.length === 0) {
      return;
    }
    const seen = new Set(tokens);
    const next = [...tokens];
    for (const token of incoming) {
      if (seen.has(token)) {
        continue;
      }
      seen.add(token);
      next.push(token);
    }
    commitTokens(next);
    setInputValue("");
  };

  const styles: StylesConfig<Option, true> = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "4px",
      borderWidth: "1px",
      borderColor:
        state.isFocused && error === undefined ? "#886ab5" : borderColor,
      boxShadow: undefined,
      "&:hover": undefined,
      minHeight: "38px",
      ...(state.isFocused && error !== undefined
        ? {
            boxShadow: "0 0 0 0.2rem rgba(253, 57, 149, 0.25)",
          }
        : undefined),
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#efeaf7",
      borderRadius: "3px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#5b3f8c",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#5b3f8c",
      ":hover": {
        backgroundColor: "#d9cceb",
        color: "#3d2a61",
      },
    }),
    menu: () => ({ display: "none" }),
    dropdownIndicator: () => ({ display: "none" }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  const handleChange = (value: OnChangeValue<Option, true>) => {
    const next = (value ?? []).map((option) => option.value);
    commitTokens(next);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!inputValue) {
      return;
    }
    switch (event.key) {
      case "Enter":
      case "Tab":
      case ",":
      case " ":
        event.preventDefault();
        addFromRaw(inputValue);
        break;
    }
  };

  return (
    <FormRow title={label} required={required}>
      <input type="hidden" name={name} value={joinTokenList(tokens)} />
      <CreatableSelect<Option, true>
        className={error !== undefined ? "is-invalid" : ""}
        isMulti
        isClearable
        menuIsOpen={false}
        inputValue={inputValue}
        value={toOptions(tokens, stripPrefix)}
        placeholder={placeholder ?? "Type and press Enter"}
        onChange={handleChange}
        onInputChange={(value, action) => {
          if (action.action !== "input-change") {
            return;
          }
          // Keep the typing field bare (no # / ^); strip as the user types or pastes.
          const bare = stripPrefix
            ? value.replace(
                new RegExp(`^\\s*${escapeRegExp(stripPrefix)}+`),
                ""
              )
            : value;
          // Comma or space in the middle of pasted/typed text: commit completed tokens.
          if (/[,\s]/.test(bare)) {
            const parts = bare.split(/[,\s]+/);
            const complete = parts.slice(0, -1).join(" ");
            const rest = parts[parts.length - 1] ?? "";
            if (complete.trim()) {
              addFromRaw(complete);
            }
            setInputValue(rest);
            return;
          }
          setInputValue(bare);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) {
            addFromRaw(inputValue);
          }
        }}
        formatCreateLabel={(value) => {
          const token = normalizeToken(value, stripPrefix);
          return `Add ${formatTokenLabel(token, stripPrefix)}`;
        }}
        styles={styles}
        theme={(theme) => ({ ...theme, borderRadius: 0 })}
        components={{
          DropdownIndicator: null,
          IndicatorSeparator: null,
        }}
        aria-label={label}
      />
      <small className="form-text text-muted">
        {hint ??
          "Type a value, then press Enter, comma, or space to add. Click × to remove."}
      </small>
      {error !== undefined ? (
        <div className="invalid-feedback d-block">{error}</div>
      ) : null}
    </FormRow>
  );
};

export default TagsInput;
