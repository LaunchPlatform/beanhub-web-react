import React, { FunctionComponent, useMemo, useState } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
import Selection from "../Shared/Selection";
import TextInput from "../Shared/TextInput";
import TagsInput from "../Shared/TagsInput";
import SubmitButton from "../Shared/SubmitButton";
import CurrencyInput from "../Shared/CurrencyInput";
import NumberInput from "../Shared/NumberInput";
import DiffPreview from "../Shared/DiffPreview";
import { getHistoryValue, setHistoryValue } from "../Shared/historyState";
import {
  FormMode,
  persistFormMode,
  resolveInitialFormMode,
  shouldUseAdvancedMode,
} from "../TransactionForm/formMode";
import ModeToggle from "../TransactionForm/ModeToggle";
import PostingListContainer, {
  PostingRecord,
} from "../TransactionForm/PostingListContainer";
import MetaListContainer, {
  MetaRecord,
} from "../TransactionForm/MetaListContainer";
import HeaderLine from "../Shared/HeaderLine";
import { PreviewType } from "../Shared/diff";
import { formatEntryBeancount } from "../TransactionForm/preview";

export enum FieldType {
  str = "str",
  number = "number",
  file = "file",
  date = "date",
  currency = "currency",
  account = "account",
  postings = "postings",
  meta = "meta",
  header = "header",
}

export interface BaseField {
  readonly name: string;
  readonly required?: boolean;
  readonly displayName?: string;
  readonly placeholder?: string;
  readonly error?: string;
}

export interface OtherField extends BaseField {
  readonly type: Exclude<
    FieldType,
    | FieldType.file
    | FieldType.currency
    | FieldType.account
    | FieldType.header
  >;
  readonly default?: string;
}

export interface HeaderField extends BaseField {
  readonly type: FieldType.header;
  readonly href?: string;
}

export interface CurrencyField extends BaseField {
  readonly type: FieldType.currency;
  readonly multiple?: boolean;
  readonly creatable?: boolean;
  readonly default?: string | Array<string>;
}

export interface FileField extends BaseField {
  readonly type: FieldType.file;
  readonly creatable?: boolean;
  readonly default?: string;
}

export interface AccountField extends BaseField {
  readonly type: FieldType.account;
  readonly creatable?: boolean;
  readonly default?: string;
}

export interface PostingsField extends BaseField {
  readonly type: FieldType.postings;
  readonly default?: Array<PostingRecord>;
}

export interface MetaField extends BaseField {
  readonly type: FieldType.meta;
  readonly default?: Array<MetaRecord>;
}

export type Field =
  | OtherField
  | CurrencyField
  | FileField
  | AccountField
  | PostingsField
  | MetaField
  | HeaderField;

export interface Props {
  readonly action?: string;
  readonly method?: string;
  readonly fields: Array<Field>;
  readonly hiddenFields?: Record<string, string>;
  readonly files: Array<string>;
  readonly currencies: Array<string>;
  readonly accounts: Array<string>;
  readonly accountCurrencies: Record<string, Array<string>>;
  readonly defaultDate: string;
  readonly errors?: Array<string>;
  readonly submit?: string;
  readonly showPreview?: boolean;
  /** When true, compare against field defaults (edit). Add flows stay Preview-only. */
  readonly showDiff?: boolean;
  readonly previewType?: PreviewType;
}

interface FieldProps {
  readonly field: Field;
  readonly files: Array<string>;
  readonly currencies: Array<string>;
  readonly accounts: Array<string>;
  readonly accountCurrencies: Record<string, Array<string>>;
  readonly defaultDate: string;
  readonly advanced: boolean;
  readonly onValueChange: (name: string, value: unknown) => void;
}

const fieldBaseName = (name: string): string => {
  const idx = name.lastIndexOf("_");
  if (idx <= 0) {
    return name;
  }
  return name.slice(idx + 1);
};

const fieldPrefix = (name: string): string | null => {
  const idx = name.lastIndexOf("_");
  if (idx <= 0) {
    return null;
  }
  return name.slice(0, idx);
};

const isFlagField = (name: string) => fieldBaseName(name) === "flag";
const isTagsField = (name: string) => fieldBaseName(name) === "tags";
const isLinksField = (name: string) => fieldBaseName(name) === "links";

const FormField: FunctionComponent<FieldProps> = ({
  field,
  currencies,
  files,
  accounts,
  defaultDate,
  accountCurrencies,
  advanced,
  onValueChange,
}: FieldProps) => {
  let initialValue = (
    "default" in field ? field.default : undefined
  ) as string | string[] | Array<PostingRecord> | Array<MetaRecord> | undefined;
  const historyValue = getHistoryValue<typeof initialValue>(field.name);
  if (historyValue !== undefined) {
    initialValue = historyValue;
  }
  const displayName = field.displayName ?? field.name;
  const placeholder = field.placeholder ?? displayName;
  const persist = (value: unknown) => {
    onValueChange(field.name, value);
    setHistoryValue(field.name, value);
  };
  // Postings/meta containers own their history.state (including row keys).
  // Only sync React Diff values here — never overwrite that richer draft.
  const syncValue = (value: unknown) => {
    onValueChange(field.name, value);
  };

  switch (field.type) {
    case FieldType.str:
      if (isFlagField(field.name)) {
        if (!advanced) {
          return (
            <input
              type="hidden"
              name={field.name}
              value={(initialValue as string) ?? "*"}
            />
          );
        }
        return (
          <SelectionInput
            title={displayName}
            name={field.name}
            values={["*", "!"]}
            initialValue={(initialValue as string) ?? "*"}
            error={field.error}
            required={field.required}
            onChange={(value) => persist(value)}
          />
        );
      }
      if (isTagsField(field.name) || isLinksField(field.name)) {
        if (!advanced) {
          return (
            <input
              type="hidden"
              name={field.name}
              value={(initialValue as string) ?? ""}
            />
          );
        }
        return (
          <TagsInput
            label={displayName}
            name={field.name}
            stripPrefix={isTagsField(field.name) ? "#" : "^"}
            placeholder={placeholder}
            initialValue={initialValue as string}
            error={field.error}
            required={field.required}
            onChange={(value) => persist(value)}
          />
        );
      }
      return (
        <TextInput
          label={displayName}
          name={field.name}
          placeholder={placeholder}
          defaultValue={initialValue as string}
          error={field.error}
          required={field.required}
          onChange={(value) => persist(value)}
        />
      );
    case FieldType.number:
      return (
        <NumberInput
          label={displayName}
          name={field.name}
          placeholder={placeholder}
          defaultValue={initialValue as string}
          error={field.error}
          required={field.required}
          onChange={(value) => persist(value)}
        />
      );
    case FieldType.date:
      if (initialValue === undefined) {
        initialValue = defaultDate;
      }
      return (
        <DateInput
          label={displayName}
          name={field.name}
          placeholder={placeholder}
          defaultValue={initialValue as string}
          error={field.error}
          required={field.required}
          onChange={(value) => persist(value)}
        />
      );
    case FieldType.currency:
      return (
        <CurrencyInput
          label={displayName}
          name={field.name}
          currencies={currencies}
          initialValue={initialValue as string}
          error={field.error}
          multiple={field.multiple}
          creatable={field.creatable}
          required={field.required}
          onChange={(value) => persist(value)}
        />
      );
    case FieldType.file:
      return (
        <SelectionInput
          title={displayName}
          name={field.name}
          values={files}
          initialValue={initialValue as string}
          error={field.error}
          required={field.required}
          creatable={field.creatable}
          onChange={(value) => persist(value)}
        />
      );
    case FieldType.account:
      return (
        <Selection
          title={displayName}
          name={field.name}
          values={accounts}
          initialValue={initialValue as string}
          error={field.error}
          required={field.required}
          creatable={field.creatable}
          onChange={(value) => persist(value)}
        />
      );
    case FieldType.postings:
      return (
        <PostingListContainer
          initialPostings={initialValue as Array<PostingRecord>}
          name={field.name}
          accounts={accounts}
          accountCurrencies={accountCurrencies}
          defaultCurrencies={currencies}
          required={field.required}
          error={field.error}
          advanced={advanced}
          onChange={syncValue}
        />
      );
    case FieldType.meta:
      return (
        <MetaListContainer
          initialMeta={initialValue as Array<MetaRecord>}
          name={field.name}
          required={field.required}
          error={field.error}
          onChange={syncValue}
        />
      );
    case FieldType.header:
      return <HeaderLine title={displayName} href={field.href} />;
  }
};

const defaultsFromFields = (
  fields: Array<Field>,
  defaultDate: string,
  options: { includeHistoryState?: boolean } = {}
): Record<string, unknown> => {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === FieldType.header) {
      continue;
    }
    let value = (
      "default" in field ? field.default : undefined
    ) as string | string[] | Array<PostingRecord> | Array<MetaRecord> | undefined;
    if (options.includeHistoryState) {
      const historyValue = getHistoryValue<typeof value>(field.name);
      if (historyValue !== undefined) {
        value = historyValue;
      }
    }
    if (field.type === FieldType.date && value === undefined) {
      value = defaultDate;
    }
    if (isFlagField(field.name) && (value === undefined || value === "")) {
      value = "*";
    }
    values[field.name] = value;
  }
  return values;
};

const initialValuesFromFields = (
  fields: Array<Field>,
  defaultDate: string
): Record<string, unknown> =>
  defaultsFromFields(fields, defaultDate, { includeHistoryState: true });

type EntryGroup = {
  key: string;
  fields: Array<Field>;
  header?: HeaderField;
};

const entryGroups = (fields: Array<Field>): Array<EntryGroup> => {
  const groups: Array<EntryGroup> = [];
  let pendingHeader: HeaderField | undefined;
  let current: EntryGroup | null = null;

  const pushCurrent = () => {
    if (current && current.fields.length > 0) {
      groups.push(current);
    }
    current = null;
  };

  for (const field of fields) {
    if (field.type === FieldType.header) {
      pushCurrent();
      pendingHeader = field;
      continue;
    }
    const prefix = fieldPrefix(field.name) ?? "__form__";
    if (!current || current.key !== prefix) {
      pushCurrent();
      current = {
        key: prefix,
        fields: [],
        header: pendingHeader,
      };
      pendingHeader = undefined;
    }
    current.fields.push(field);
  }
  pushCurrent();
  if (groups.length === 0) {
    return [{ key: "__form__", fields }];
  }
  return groups;
};

const stripPrefixValues = (
  values: Record<string, unknown>,
  prefix: string | null
): Record<string, unknown> => {
  if (!prefix || prefix === "__form__") {
    return values;
  }
  const result: Record<string, unknown> = {};
  const fullPrefix = `${prefix}_`;
  for (const [key, value] of Object.entries(values)) {
    if (key.startsWith(fullPrefix)) {
      result[key.slice(fullPrefix.length)] = value;
    }
  }
  return result;
};

const Form: FunctionComponent<Props> = ({
  action,
  method,
  fields,
  hiddenFields,
  files,
  currencies,
  accounts,
  accountCurrencies,
  defaultDate,
  errors,
  submit,
  showPreview,
  showDiff,
  previewType,
}: Props) => {
  const hasTxnFields = fields.some((field) => field.type === FieldType.postings);
  const [mode, setMode] = useState<FormMode>(() => {
    if (!hasTxnFields) {
      return "simple";
    }
    // Include history.state so a restored `!` flag / tags / costs re-infers
    // Advanced when formMode itself was not yet persisted.
    const liveValues = initialValuesFromFields(fields, defaultDate);
    const needsAdvanced = fields.some((field) => {
      if (isFlagField(field.name)) {
        return shouldUseAdvancedMode({
          initialFlag: liveValues[field.name] as string | undefined,
        });
      }
      if (isTagsField(field.name)) {
        return shouldUseAdvancedMode({
          initialTags: liveValues[field.name] as string | undefined,
        });
      }
      if (isLinksField(field.name)) {
        return shouldUseAdvancedMode({
          initialLinks: liveValues[field.name] as string | undefined,
        });
      }
      if (field.type === FieldType.postings) {
        return shouldUseAdvancedMode({
          initialPostings: liveValues[field.name] as
            | Array<PostingRecord>
            | undefined,
        });
      }
      return false;
    });
    const resolved = resolveInitialFormMode({
      initialMode: needsAdvanced ? "advanced" : undefined,
    });
    persistFormMode(resolved);
    return resolved;
  });
  const updateMode = (next: FormMode) => {
    persistFormMode(next);
    setMode(next);
  };
  const advanced = !hasTxnFields || mode === "advanced";
  // Baseline is DB/form defaults only — Diff original must not include
  // browser history state from in-progress edits.
  const baselineValues = useMemo(
    () => defaultsFromFields(fields, defaultDate),
    [fields, defaultDate]
  );
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    initialValuesFromFields(fields, defaultDate)
  );

  const groups = useMemo(() => entryGroups(fields), [fields]);
  const previews = groups.map((group) => {
    const prefix = group.key === "__form__" ? null : group.key;
    const kind = previewType ?? "auto";
    const source = formatEntryBeancount(
      kind,
      stripPrefixValues(values, prefix)
    );
    const original = formatEntryBeancount(
      kind,
      stripPrefixValues(baselineValues, prefix)
    );
    return {
      key: group.key,
      source,
      original,
    };
  });

  return (
    <form action={action} method={method ?? "POST"}>
      {hasTxnFields ? (
        <ModeToggle mode={mode} onChange={updateMode} />
      ) : null}
      {groups.map((group, index) => {
        const preview = previews[index];
        return (
          <React.Fragment key={group.key}>
            {group.header ? (
              <HeaderLine
                title={group.header.displayName ?? group.header.name}
                href={group.header.href}
              />
            ) : null}
            {group.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                currencies={currencies}
                files={files}
                accounts={accounts}
                accountCurrencies={accountCurrencies}
                defaultDate={defaultDate}
                advanced={advanced}
                onValueChange={(name, value) =>
                  setValues((current) => ({ ...current, [name]: value }))
                }
              />
            ))}
            {showPreview ? (
              <DiffPreview
                original={showDiff ? preview.original : undefined}
                updated={preview.source}
              />
            ) : null}
          </React.Fragment>
        );
      })}
      {hiddenFields !== undefined
        ? Object.entries(hiddenFields).map(([key, value]) => (
            <input type="hidden" name={key} value={value} />
          ))
        : null}
      {(errors ?? []).map((error, index) => (
        <ErrorRow key={index} message={error} />
      ))}
      <SubmitButton title={submit ?? "Submit"} />
    </form>
  );
};
export default Form;
