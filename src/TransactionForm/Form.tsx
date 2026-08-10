import { FunctionComponent, useContext, useState } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
import TextInput from "../Shared/TextInput";
import TagsInput from "../Shared/TagsInput";
import PostingListContainer, { PostingRecord } from "./PostingListContainer";
import MetaListContainer, { MetaRecord } from "./MetaListContainer";
import SubmitButton from "../Shared/SubmitButton";
import { getHistoryValue, setHistoryValue } from "../Shared/historyState";
import { InputPrefixContext } from "./context";
import {
  FormMode,
  persistFormMode,
  resolveInitialFormMode,
} from "./formMode";
import ModeToggle from "./ModeToggle";
import DiffPreview from "../Shared/DiffPreview";
import { formatTransactionBeancount } from "./preview";
import {
  normalizePostingStates,
  postingStatesToRecords,
} from "./postingState";
import { metaStatesToRecords, normalizeMetaStates } from "./metaState";

export interface Props {
  readonly action?: string;
  readonly method?: string;
  readonly submitButtonTitle?: string;
  readonly initialFile?: string;
  readonly fileError?: string;
  readonly initialDate?: string;
  readonly dateError?: string;
  readonly initialFlag?: string;
  readonly flagError?: string;
  readonly initialPayee?: string;
  readonly payeeError?: string;
  readonly initialNarration?: string;
  readonly narrationError?: string;
  readonly initialTags?: string;
  readonly tagsError?: string;
  readonly initialLinks?: string;
  readonly linksError?: string;
  readonly initialPostings?: Array<PostingRecord>;
  readonly initialMeta?: Array<MetaRecord>;
  readonly hiddenFields?: Record<string, string>;
  readonly files: Array<string>;
  readonly accounts: Array<string>;
  readonly accountCurrencies: Record<string, Array<string>>;
  readonly defaultCurrencies: Array<string>;
  readonly errors?: Array<string>;
  readonly initialMode?: FormMode;
  readonly showPreview?: boolean;
  /** When true, compare against prop defaults (edit). Add flows stay Preview-only. */
  readonly showDiff?: boolean;
}

const Form: FunctionComponent<Props> = ({
  action,
  method,
  submitButtonTitle,
  initialFile,
  fileError,
  initialDate,
  dateError,
  initialFlag,
  flagError,
  initialPayee,
  payeeError,
  initialNarration,
  narrationError,
  initialTags,
  tagsError,
  initialLinks,
  linksError,
  initialPostings,
  initialMeta,
  hiddenFields,
  files,
  accounts,
  accountCurrencies,
  defaultCurrencies,
  errors,
  initialMode,
  showPreview,
  showDiff,
}: Props) => {
  const inputPrefix = useContext(InputPrefixContext);
  const historyKey = (suffix: string) => `${inputPrefix}${suffix}`;
  const fromHistory = <T,>(suffix: string, fallback?: T): T | undefined => {
    const stored = getHistoryValue<T>(historyKey(suffix));
    return stored !== undefined ? stored : fallback;
  };
  const persist = (suffix: string, value: unknown) => {
    setHistoryValue(historyKey(suffix), value);
  };

  const initialFileValue = fromHistory("file", initialFile);
  const initialDateValue = fromHistory("date", initialDate);
  const initialFlagValue = fromHistory("flag", initialFlag);
  const initialNarrationValue = fromHistory("narration", initialNarration);
  const initialPayeeValue = fromHistory("payee", initialPayee);
  const initialTagsValue = fromHistory("tags", initialTags);
  const initialLinksValue = fromHistory("links", initialLinks);
  const historyPostings = getHistoryValue<unknown>(historyKey("postings"));
  const historyMeta = getHistoryValue<unknown>(historyKey("metadata"));
  const effectivePostings =
    historyPostings !== undefined
      ? postingStatesToRecords(normalizePostingStates(historyPostings))
      : initialPostings;
  const effectiveMeta =
    historyMeta !== undefined
      ? metaStatesToRecords(normalizeMetaStates(historyMeta))
      : initialMeta;

  const [mode, setMode] = useState<FormMode>(() => {
    const resolved = resolveInitialFormMode({
      initialMode,
      initialFlag: initialFlagValue,
      flagError,
      initialTags: initialTagsValue,
      tagsError,
      initialLinks: initialLinksValue,
      linksError,
      initialPostings: effectivePostings,
    });
    persistFormMode(resolved);
    return resolved;
  });
  const updateMode = (next: FormMode) => {
    persistFormMode(next);
    setMode(next);
  };
  const [dateValue, setDateValue] = useState<string>(initialDateValue ?? "");
  const [flagValue, setFlagValue] = useState<string>(
    initialFlagValue ?? "*"
  );
  const [payeeValue, setPayeeValue] = useState<string>(
    initialPayeeValue ?? ""
  );
  const [narrationValue, setNarrationValue] = useState<string>(
    initialNarrationValue ?? ""
  );
  const [tagsValue, setTagsValue] = useState<string>(initialTagsValue ?? "");
  const [linksValue, setLinksValue] = useState<string>(
    initialLinksValue ?? ""
  );
  const [postingsValue, setPostingsValue] = useState<Array<PostingRecord>>(
    effectivePostings ?? []
  );
  const [metaValue, setMetaValue] = useState<Array<MetaRecord>>(
    effectiveMeta ?? []
  );

  const advanced = mode === "advanced";
  // Diff baseline uses prop defaults (DB / server), not history.state.
  const originalSource = formatTransactionBeancount({
    date: initialDate ?? "",
    flag: initialFlag ?? "*",
    payee: initialPayee ?? "",
    narration: initialNarration ?? "",
    tags: initialTags ?? "",
    links: initialLinks ?? "",
    postings: initialPostings ?? [],
    metadata: initialMeta ?? [],
  });
  const previewSource = formatTransactionBeancount({
    date: dateValue,
    flag: flagValue,
    payee: payeeValue,
    narration: narrationValue,
    tags: tagsValue,
    links: linksValue,
    postings: postingsValue,
    metadata: metaValue,
  });

  return (
    <form action={action} method={method ?? "POST"}>
      <ModeToggle mode={mode} onChange={updateMode} />
      <SelectionInput
        title="File"
        name={`${inputPrefix}file`}
        values={files}
        initialValue={initialFileValue}
        error={fileError}
        required
        onChange={(value) => {
          persist("file", value);
        }}
      />
      <DateInput
        defaultValue={initialDateValue}
        name={`${inputPrefix}date`}
        error={dateError}
        required
        onChange={(value) => {
          setDateValue(value);
          persist("date", value);
        }}
      />
      {advanced ? (
        <SelectionInput
          title="Flag"
          name={`${inputPrefix}flag`}
          values={["*", "!"]}
          initialValue={flagValue}
          error={flagError}
          required
          onChange={(value) => {
            setFlagValue(value);
            persist("flag", value);
          }}
        />
      ) : (
        <input type="hidden" name={`${inputPrefix}flag`} value={flagValue} />
      )}
      <TextInput
        label="Payee"
        name={`${inputPrefix}payee`}
        placeholder="Payee of the transaction"
        defaultValue={initialPayeeValue}
        error={payeeError}
        onChange={(value) => {
          setPayeeValue(value);
          persist("payee", value);
        }}
      />
      <TextInput
        label="Narration"
        name={`${inputPrefix}narration`}
        placeholder="Narration of the transaction"
        defaultValue={initialNarrationValue}
        error={narrationError}
        required
        onChange={(value) => {
          setNarrationValue(value);
          persist("narration", value);
        }}
      />
      {advanced ? (
        <>
          <TagsInput
            label="Tags"
            name={`${inputPrefix}tags`}
            stripPrefix="#"
            placeholder="Add a tag"
            initialValue={initialTagsValue}
            error={tagsError}
            onChange={(value) => {
              setTagsValue(value);
              persist("tags", value);
            }}
          />
          <TagsInput
            label="Links"
            name={`${inputPrefix}links`}
            stripPrefix="^"
            placeholder="Add a link"
            initialValue={initialLinksValue}
            error={linksError}
            onChange={(value) => {
              setLinksValue(value);
              persist("links", value);
            }}
          />
        </>
      ) : (
        <>
          <input type="hidden" name={`${inputPrefix}tags`} value={tagsValue} />
          <input
            type="hidden"
            name={`${inputPrefix}links`}
            value={linksValue}
          />
        </>
      )}
      <PostingListContainer
        name={`${inputPrefix}postings`}
        initialPostings={initialPostings}
        accounts={accounts}
        accountCurrencies={accountCurrencies}
        defaultCurrencies={defaultCurrencies}
        advanced={advanced}
        required
        onChange={setPostingsValue}
      />
      <MetaListContainer
        name={`${inputPrefix}metadata`}
        initialMeta={initialMeta}
        onChange={setMetaValue}
      />
      {showPreview ? (
        <DiffPreview
          original={showDiff ? originalSource : undefined}
          updated={previewSource}
        />
      ) : null}
      {hiddenFields !== undefined
        ? Object.entries(hiddenFields).map(([key, value]) => (
            <input type="hidden" name={key} value={value} />
          ))
        : null}
      {(errors ?? []).map((error, index) => (
        <ErrorRow key={index} message={error} />
      ))}
      <SubmitButton title={submitButtonTitle ?? "Add"} />
    </form>
  );
};
export default Form;
