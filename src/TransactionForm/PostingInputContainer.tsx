import React, {
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Candidate } from "./PostingCandidateList";
import PostingInput from "./PostingInput";

export interface Props {
  readonly index: number;
  readonly account?: string;
  readonly accountError?: string;
  readonly unitNumber?: string;
  readonly unitNumberError?: string;
  readonly unitCurrency?: string;
  readonly unitCurrencyError?: string;
  readonly accounts: Array<string>;
  readonly currencies: Array<string>;
  readonly onAccountChange?: (value: string) => void;
  readonly onUnitNumberChange?: (value: string) => void;
  readonly onUnitCurrencyChange?: (value: string) => void;
  readonly onDelete?: () => void;
}

interface AutoCompleteProps {
  readonly value: string;
  readonly candidateIndex: number;
  readonly candidates?: Array<Candidate>;
  readonly onChange: (value: string) => void;
  readonly onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  readonly onBlur: () => void;
  readonly onCandidateClick: (value: string) => void;
}

const useAutoComplete = (
  inputValue: string,
  candidateValues: Array<string>,
  onValueChange?: (value: string) => void
): AutoCompleteProps => {
  const [value, setValue] = useState<string>(inputValue ?? "");
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [displayCandidates, setDisplayCandidates] = useState<boolean>(false);

  const lowerTrimedValue = value.trim().toLowerCase();
  const matchedValues: Array<Candidate> = useMemo(
    () =>
      candidateValues
        .filter((candidateValue) =>
          candidateValue.toLowerCase().startsWith(lowerTrimedValue)
        )
        .map(
          (candidateValue) =>
            ({
              value: candidateValue,
              prefix: candidateValue.substring(0, lowerTrimedValue.length),
              suffix: candidateValue.substring(
                lowerTrimedValue.length,
                candidateValue.length
              ),
            } as Candidate)
        ),
    [lowerTrimedValue, candidateValues]
  );
  const onChange = useCallback(
    (value) => {
      setValue(value);
      setDisplayCandidates(true);
      onValueChange?.(value);
    },
    [onValueChange]
  );
  const onKeyDown = useCallback(
    (event) => {
      if (!displayCandidates) {
        // we are not showing candidates, just let the default behavior
        // takes over
        return;
      }
      let delta = 0;
      switch (event.key) {
        case "Tab": {
          delta = event.shiftKey ? -1 : 1;
          break;
        }
        case "ArrowUp": {
          delta = -1;
          break;
        }
        case "ArrowDown": {
          delta = 1;
          break;
        }
        case "Escape": {
          setDisplayCandidates(false);
          break;
        }
      }
      if (delta !== 0) {
        const size = matchedValues.length;
        const nextIndex = (candidateIndex + size + delta) % size;
        setCandidateIndex(nextIndex);
        event.preventDefault();
      }
    },
    [matchedValues, candidateIndex, displayCandidates]
  );
  const onKeyPress = useCallback(
    (event) => {
      switch (event.key) {
        case "Enter":
        case " ": {
          const newValue = matchedValues[candidateIndex].value;
          setValue(newValue);
          setDisplayCandidates(false);
          setCandidateIndex(0);
          event.preventDefault();
          onValueChange?.(newValue);
          break;
        }
      }
    },
    [matchedValues, candidateIndex, onValueChange]
  );
  const onCandidateClick = useCallback(
    (value) => {
      setValue(value);
      setDisplayCandidates(false);
      setCandidateIndex(0);
      onValueChange?.(value);
    },
    [onValueChange]
  );
  const onBlur = useCallback(() => {
    setDisplayCandidates(false);
    setCandidateIndex(0);
  }, []);
  return {
    value,
    candidateIndex,
    candidates: displayCandidates ? matchedValues : undefined,
    onChange,
    onKeyDown,
    onKeyPress,
    onCandidateClick,
    onBlur,
  };
};

const PostingInputContainer: FunctionComponent<Props> = ({
  account,
  accountError,
  unitNumber,
  unitCurrencyError,
  unitCurrency,
  unitNumberError,
  accounts,
  currencies,
  index,
  onAccountChange,
  onUnitNumberChange,
  onUnitCurrencyChange,
  onDelete,
}: Props) => {
  const [unitNumberValue, setUnitNumberValue] = useState<string>(
    unitNumber ?? ""
  );

  const accountProps = useAutoComplete(
    account ?? "",
    accounts,
    onAccountChange
  );
  const unitCurrencyProps = useAutoComplete(
    unitCurrency ?? "",
    currencies,
    onUnitCurrencyChange
  );

  return (
    <PostingInput
      index={index}
      onDelete={onDelete}
      // Account value
      account={accountProps.value}
      accountError={accountError}
      accountCandidates={accountProps.candidates}
      accountCandidateIndex={accountProps.candidateIndex}
      onAccountChange={accountProps.onChange}
      onAccountKeyDown={accountProps.onKeyDown}
      onAccountKeyPress={accountProps.onKeyPress}
      onAccountCandidateClick={accountProps.onCandidateClick}
      onAccountBlur={accountProps.onBlur}
      // Unit number
      unitNumber={unitNumberValue}
      unitNumberError={unitNumberError}
      onUnitNumberChange={(value) => {
        onUnitNumberChange?.(value);
        setUnitNumberValue(value);
      }}
      // Unit currency
      unitCurrency={unitCurrencyProps.value}
      unitCurrencyCandidates={unitCurrencyProps.candidates}
      unitCurrencyCandidateIndex={unitCurrencyProps.candidateIndex}
      unitCurrencyError={unitCurrencyError}
      onUnitCurrencyChange={unitCurrencyProps.onChange}
      onUnitCurrencyKeyDown={unitCurrencyProps.onKeyDown}
      onUnitCurrencyKeyPress={unitCurrencyProps.onKeyPress}
      onUnitCurrencyCandidateClick={unitCurrencyProps.onCandidateClick}
      onUnitCurrencyBlur={unitCurrencyProps.onBlur}
    />
  );
};

export default PostingInputContainer;
