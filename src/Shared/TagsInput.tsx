import React, {
  FunctionComponent,
  KeyboardEventHandler,
  MouseEvent,
  useRef,
  useState,
} from "react";
import CreatableSelect from "react-select/creatable";
import {
  MultiValueGenericProps,
  OnChangeValue,
  SelectInstance,
  StylesConfig,
} from "react-select";
import FormRow from "./FormRow";
import {
  formatTokenLabel,
  isValidToken,
  joinTokenList,
  normalizeToken,
  parseTokenList,
  sanitizeTokenInput,
  splitRawTokenInput,
} from "./tagTokens";

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
  const selectRef = useRef<SelectInstance<Option, true>>(null);
  const editingOriginalRef = useRef<string | null>(null);
  const [tokens, setTokens] = useState<Array<string>>(
    parseTokenList(initialValue, stripPrefix)
  );
  const [inputValue, setInputValue] = useState("");
  const borderColor = error !== undefined ? "#fd3995" : "#E5E5E5";

  const commitTokens = (next: Array<string>) => {
    setTokens(next);
    onChange?.(joinTokenList(next));
  };

  const mergeIncoming = (
    current: Array<string>,
    raw: string
  ): Array<string> => {
    const incoming = splitRawTokenInput(raw, stripPrefix);
    if (incoming.length === 0) {
      return current;
    }
    const seen = new Set(current);
    const next = [...current];
    for (const token of incoming) {
      if (seen.has(token)) {
        continue;
      }
      seen.add(token);
      next.push(token);
    }
    return next;
  };

  const addFromRaw = (raw: string) => {
    editingOriginalRef.current = null;
    commitTokens(mergeIncoming(tokens, raw));
    setInputValue("");
  };

  /** Click a chip → move bare value into the input for editing. */
  const beginEdit = (token: string) => {
    let next = tokens;
    if (inputValue.trim()) {
      next = mergeIncoming(next, inputValue);
    }
    next = next.filter((item) => item !== token);
    commitTokens(next);
    editingOriginalRef.current = token;
    setInputValue(token);
    window.requestAnimationFrame(() => {
      selectRef.current?.focus();
    });
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
      cursor: "text",
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
    switch (event.key) {
      case "Enter":
      case "Tab":
      case ",":
      case " ":
        if (!inputValue) {
          return;
        }
        event.preventDefault();
        addFromRaw(inputValue);
        break;
      case "Escape":
        event.preventDefault();
        if (editingOriginalRef.current !== null) {
          const original = editingOriginalRef.current;
          editingOriginalRef.current = null;
          commitTokens(mergeIncoming(tokens, original));
          setInputValue("");
        } else {
          setInputValue("");
        }
        break;
    }
  };

  const MultiValueLabel = (
    props: MultiValueGenericProps<Option, true>
  ) => {
    const token = props.data.value;
    const onMouseDown = (event: MouseEvent) => {
      // Keep select from taking the click as a blur/clear; start edit instead.
      event.preventDefault();
      event.stopPropagation();
      beginEdit(token);
    };
    return (
      <div
        {...props.innerProps}
        onMouseDown={onMouseDown}
        title="Click to edit"
        role="button"
        tabIndex={-1}
      >
        {props.children}
      </div>
    );
  };

  return (
    <FormRow title={label} required={required}>
      <input type="hidden" name={name} value={joinTokenList(tokens)} />
      <CreatableSelect<Option, true>
        ref={selectRef}
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
          const bare = sanitizeTokenInput(value, stripPrefix);
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
        isValidNewOption={(value) => {
          const token = normalizeToken(value, stripPrefix);
          return isValidToken(token);
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
          MultiValueLabel,
        }}
        aria-label={label}
      />
      <small className="form-text text-muted">
        {hint ??
          "Press Enter, comma, or space to add. Click a chip to edit; × to remove."}
      </small>
      {error !== undefined ? (
        <div className="invalid-feedback d-block">{error}</div>
      ) : null}
    </FormRow>
  );
};

export default TagsInput;
