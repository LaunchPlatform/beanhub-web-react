import { FunctionComponent, useContext } from "react";
import DateInput from "../Shared/DateInput";
import ErrorRow from "../Shared/ErrorRow";
import SelectionInput from "../Shared/Selection";
import TextInput from "../Shared/TextInput";
import PostingListContainer, { PostingRecord } from "./PostingListContainer";
import MetaListContainer, { MetaRecord } from "./MetaListContainer";
import SubmitButton from "../Shared/SubmitButton";
import { InputPrefixContext } from "./context";

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

  return (
    <form action={action} method={method ?? "POST"}>
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
          window.history.replaceState(
            {
              ...window.history.state,
              date: value,
            },
            ""
          );
        }}
      />
      <SelectionInput
        title="Flag"
        name={`${inputPrefix}flag`}
        values={["*", "!"]}
        initialValue={initialFlagValue ?? "*"}
        error={flagError}
        required
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              flag: value,
            },
            ""
          );
        }}
      />
      <TextInput
        label="Payee"
        name={`${inputPrefix}payee`}
        placeholder="Payee of the transaction"
        defaultValue={initialPayeeValue}
        error={payeeError}
        onChange={(value) => {
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
          window.history.replaceState(
            {
              ...window.history.state,
              narration: value,
            },
            ""
          );
        }}
      />
      <TextInput
        label="Tags"
        name={`${inputPrefix}tags`}
        placeholder="tag1 tag2"
        defaultValue={initialTagsValue}
        error={tagsError}
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              tags: value,
            },
            ""
          );
        }}
      />
      <TextInput
        label="Links"
        name={`${inputPrefix}links`}
        placeholder="link1 link2"
        defaultValue={initialLinksValue}
        error={linksError}
        onChange={(value) => {
          window.history.replaceState(
            {
              ...window.history.state,
              links: value,
            },
            ""
          );
        }}
      />
      <PostingListContainer
        name={`${inputPrefix}postings`}
        initialPostings={initialPostings}
        accounts={accounts}
        accountCurrencies={accountCurrencies}
        defaultCurrencies={defaultCurrencies}
        required
      />
      <MetaListContainer
        name={`${inputPrefix}metadata`}
        initialMeta={initialMeta}
      />
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
