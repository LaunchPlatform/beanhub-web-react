import React, {
  FunctionComponent,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  useEffect,
  useMemo,
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

interface EditSession {
  original: string;
  draft: string;
}

interface LabelHelpers {
  stripPrefix?: string;
  editingToken: string | null;
  editingValue: string;
  editSessionRef: React.MutableRefObject<EditSession | null>;
  chipEditRef: React.MutableRefObject<HTMLInputElement | null>;
  beginEdit: (token: string) => void;
  finishEdit: (save: boolean) => void;
  setEditingValue: (value: string) => void;
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
  const chipEditRef = useRef<HTMLInputElement | null>(null);
  const editSessionRef = useRef<EditSession | null>(null);
  const labelHelpersRef = useRef<LabelHelpers | null>(null);
  const [tokens, setTokens] = useState<Array<string>>(
    parseTokenList(initialValue, stripPrefix)
  );
  const [inputValue, setInputValue] = useState("");
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const borderColor = error !== undefined ? "#fd3995" : "#E5E5E5";

  useEffect(() => {
    if (editingToken !== null) {
      chipEditRef.current?.focus();
      chipEditRef.current?.select();
    }
  }, [editingToken]);

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
    setTokens((current) => {
      const next = mergeIncoming(current, raw);
      onChange?.(joinTokenList(next));
      return next;
    });
    setInputValue("");
  };

  const beginEdit = (token: string) => {
    if (editSessionRef.current !== null) {
      return;
    }
    if (inputValue.trim()) {
      addFromRaw(inputValue);
    }
    editSessionRef.current = { original: token, draft: token };
    setEditingToken(token);
    setEditingValue(token);
  };

  const finishEdit = (save: boolean) => {
    const session = editSessionRef.current;
    if (session === null) {
      return;
    }
    editSessionRef.current = null;
    const { original, draft } = session;
    setEditingToken(null);
    setEditingValue("");

    if (!save) {
      return;
    }

    const nextToken = normalizeToken(draft, stripPrefix);
    if (!nextToken || nextToken === original) {
      return;
    }

    setTokens((current) => {
      const withoutOriginal = current.filter((item) => item !== original);
      const next = withoutOriginal.includes(nextToken)
        ? withoutOriginal
        : current.map((item) => (item === original ? nextToken : item));
      onChange?.(joinTokenList(next));
      return next;
    });
  };

  const updateEditingValue = (value: string) => {
    if (editSessionRef.current !== null) {
      editSessionRef.current = {
        ...editSessionRef.current,
        draft: value,
      };
    }
    setEditingValue(value);
  };

  labelHelpersRef.current = {
    stripPrefix,
    editingToken,
    editingValue,
    editSessionRef,
    chipEditRef,
    beginEdit,
    finishEdit,
    setEditingValue: updateEditingValue,
  };

  // Stable component identity — recreating MultiValueLabel each render remounts
  // the chip <input> and blurs mid-edit (only the last typed character survives).
  const MultiValueLabel = useMemo(() => {
    const Label = (props: MultiValueGenericProps<Option, true>) => {
      const helpers = labelHelpersRef.current;
      if (helpers === null) {
        return <div {...props.innerProps}>{props.children}</div>;
      }
      const {
        stripPrefix: prefix,
        editingToken: active,
        editingValue: draft,
        chipEditRef: inputRef,
        beginEdit: start,
        finishEdit: stop,
        setEditingValue: setDraft,
      } = helpers;
      const token = props.data.value;
      const isEditing = active === token;

      if (isEditing) {
        const onChipKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
          event.stopPropagation();
          if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault();
            stop(true);
          } else if (event.key === "Escape") {
            event.preventDefault();
            stop(false);
          } else if (event.key === "," || event.key === " ") {
            event.preventDefault();
            stop(true);
          }
        };
        return (
          <div
            {...props.innerProps}
            style={{ display: "flex", alignItems: "center" }}
          >
            {prefix ? (
              <span
                style={{
                  color: "#5b3f8c",
                  paddingLeft: 6,
                  fontSize: "85%",
                  lineHeight: 1,
                }}
              >
                {prefix}
              </span>
            ) : null}
            <input
              ref={inputRef}
              value={draft}
              aria-label={`Edit ${formatTokenLabel(token, prefix)}`}
              onChange={(event) => {
                setDraft(sanitizeTokenInput(event.target.value, prefix));
              }}
              onKeyDown={onChipKeyDown}
              onBlur={() => stop(true)}
              onMouseDown={(event: MouseEvent) => {
                event.stopPropagation();
              }}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#5b3f8c",
                fontSize: "85%",
                padding: prefix ? "3px 6px 3px 0" : "3px 6px",
                margin: 0,
                minWidth: `${Math.max(draft.length, 1)}ch`,
                width: `${Math.max(draft.length + 1, 2)}ch`,
              }}
            />
          </div>
        );
      }

      const onMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        start(token);
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
    Label.displayName = "TagsMultiValueLabel";
    return Label;
  }, []);

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
    if (editSessionRef.current !== null) {
      finishEdit(true);
    }
    const next = (value ?? []).map((option) => option.value);
    commitTokens(next);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (editSessionRef.current !== null) {
      return;
    }
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
    }
  };

  const selectComponents = useMemo(
    () => ({
      DropdownIndicator: null,
      IndicatorSeparator: null,
      MultiValueLabel,
    }),
    [MultiValueLabel]
  );

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
          if (editSessionRef.current !== null) {
            finishEdit(true);
          }
          const bare = sanitizeTokenInput(value, stripPrefix);
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
          if (editSessionRef.current !== null) {
            return;
          }
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
        components={selectComponents}
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
