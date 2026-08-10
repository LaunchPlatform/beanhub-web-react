import { FunctionComponent, useContext, useState } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
import TextInput from "../Shared/TextInput";
import TagsInput from "../Shared/TagsInput";
import PostingListContainer, { PostingRecord } from "./PostingListContainer";
import MetaListContainer, { MetaRecord } from "./MetaListContainer";
import SubmitButton from "../Shared/SubmitButton";
import { InputPrefixContext } from "./context";
import {
  FormMode,
  persistFormMode,
  resolveInitialFormMode,
} from "./formMode";
import ModeToggle from "./ModeToggle";
import DiffPreview from "../Shared/DiffPreview";
import { formatTransactionBeancount } from "./preview";

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
}: Props) => {
  const inputPrefix = useContext(InputPrefixContext);
  let initialFileValue = initialFile;
  let initialDateValue = initialDate;
  let initialFlagValue = initialFlag;
  let initialNarrationValue = initialNarration;
  let initialPayeeValue = initialPayee;
  let initialTagsValue = initialTags;
  let initialLinksValue = initialLinks;
  if (window.history.state?.file !== undefined) {
    initialFileValue = window.history.state?.file;
  }
  if (window.history.state?.date !== undefined) {
    initialDateValue = window.history.state?.date;
  }
  if (window.history.state?.flag !== undefined) {
    initialFlagValue = window.history.state?.flag;
  }
  if (window.history.state?.narration !== undefined) {
    initialNarrationValue = window.history.state?.narration;
  }
  if (window.history.state?.payee !== undefined) {
    initialPayeeValue = window.history.state?.payee;
  }
  if (window.history.state?.tags !== undefined) {
    initialTagsValue = window.history.state?.tags;
  }
  if (window.history.state?.links !== undefined) {
    initialLinksValue = window.history.state?.links;
  }

  const [mode, setMode] = useState<FormMode>(() => {
    const resolved = resolveInitialFormMode({
      initialMode,
      initialFlag: initialFlagValue,
      flagError,
      initialTags: initialTagsValue,
      tagsError,
      initialLinks: initialLinksValue,
      linksError,
      initialPostings,
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
    initialPostings ?? []
  );
  const [metaValue, setMetaValue] = useState<Array<MetaRecord>>(
    initialMeta ?? []
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
          window.history.replaceState(
            {
              ...window.history.state,
              file: value,
            },
            ""
          );
        }}
      />
      <DateInput
        defaultValue={initialDateValue}
        name={`${inputPrefix}date`}
        error={dateError}
        required
        onChange={(value) => {
          setDateValue(value);
          window.history.replaceState(
            {
              ...window.history.state,
              date: value,
            },
            ""
          );
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
            window.history.replaceState(
              {
                ...window.history.state,
                flag: value,
              },
              ""
            );
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
          window.history.replaceState(
            {
              ...window.history.state,
              payee: value,
            },
            ""
          );
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
          window.history.replaceState(
            {
              ...window.history.state,
              narration: value,
            },
            ""
          );
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
              window.history.replaceState(
                {
                  ...window.history.state,
                  tags: value,
                },
                ""
              );
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
              window.history.replaceState(
                {
                  ...window.history.state,
                  links: value,
                },
                ""
              );
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
        <DiffPreview original={originalSource} updated={previewSource} />
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
