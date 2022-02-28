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
  readonly unitNumber?: string;
  readonly unitCurrency?: string;
  readonly accounts: Array<string>;
  readonly currencies: Array<string>;
  readonly onAccountChange?: (value: string) => void;
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
  candidateValues: Array<string>
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
  const onChange = useCallback((value) => {
    setValue(value);
    setDisplayCandidates(true);
  }, []);
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
    [value, matchedValues, candidateIndex, displayCandidates]
  );
  const onKeyPress = useCallback(
    (event) => {
      switch (event.key) {
        case "Enter":
        case " ": {
          setValue(matchedValues[candidateIndex].value);
          setDisplayCandidates(false);
          setCandidateIndex(0);
          event.preventDefault();
          break;
        }
      }
    },
    [matchedValues, candidateIndex]
  );
  const onCandidateClick = useCallback((value) => {
    setValue(value);
    setDisplayCandidates(false);
    setCandidateIndex(0);
  }, []);
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
  unitNumber,
  unitCurrency,
  accounts,
  currencies,
  index,
  onAccountChange,
  onDelete,
}: Props) => {
  const [unitNumberValue, setUnitNumberValue] = useState<string>(
    unitNumber ?? ""
  );

  const accountProps = useAutoComplete(account ?? "", accounts);
  const unitCurrencyProps = useAutoComplete(unitCurrency ?? "", currencies);

  return (
    <PostingInput
      index={index}
      onDelete={onDelete}
      // Account value
      account={accountProps.value}
      accountCandidates={accountProps.candidates}
      accountCandidateIndex={accountProps.candidateIndex}
      onAccountChange={(value) => {
        onAccountChange?.(value);
        accountProps.onChange(value);
      }}
      onAccountKeyDown={accountProps.onKeyDown}
      onAccountKeyPress={accountProps.onKeyPress}
      onAccountCandidateClick={accountProps.onCandidateClick}
      onAccountBlur={accountProps.onBlur}
      // Unit number
      unitNumber={unitNumberValue}
      onUnitNumberChange={setUnitNumberValue}
      // Unit currency
      unitCurrency={unitCurrencyProps.value}
      unitCurrencyCandidates={unitCurrencyProps.candidates}
      unitCurrencyCandidateIndex={unitCurrencyProps.candidateIndex}
      onUnitCurrencyChange={unitCurrencyProps.onChange}
      onUnitCurrencyKeyDown={unitCurrencyProps.onKeyDown}
      onUnitCurrencyKeyPress={unitCurrencyProps.onKeyPress}
      onUnitCurrencyCandidateClick={unitCurrencyProps.onCandidateClick}
      onUnitCurrencyBlur={unitCurrencyProps.onBlur}
    />
  );
};

export default PostingInputContainer;
