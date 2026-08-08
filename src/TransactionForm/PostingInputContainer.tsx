import React, {
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Candidate } from "./PostingCandidateList";
import PostingInput, { CostMode, PriceMode } from "./PostingInput";
import { fuzzyMatch } from "./fuzzyMatch";

export interface Props {
  readonly name: string;
  readonly account?: string;
  readonly accountError?: string;
  readonly unitNumber?: string;
  readonly unitNumberError?: string;
  readonly unitCurrency?: string;
  readonly unitCurrencyError?: string;
  readonly unitCurrencyUpdateCounter?: number;
  readonly flag?: string;
  readonly flagError?: string;
  readonly costNumber?: string;
  readonly costNumberError?: string;
  readonly costCurrency?: string;
  readonly costCurrencyError?: string;
  readonly costCurrencyUpdateCounter?: number;
  readonly costDate?: string;
  readonly costDateError?: string;
  readonly costLabel?: string;
  readonly costLabelError?: string;
  readonly initialCostMode?: CostMode;
  readonly costExpanded?: boolean;
  readonly priceNumber?: string;
  readonly priceNumberError?: string;
  readonly priceCurrency?: string;
  readonly priceCurrencyError?: string;
  readonly priceCurrencyUpdateCounter?: number;
  readonly initialPriceMode?: PriceMode;
  readonly priceExpanded?: boolean;
  readonly accounts: Array<string>;
  readonly currencies: Array<string>;
  readonly advanced?: boolean;
  readonly onAccountChange?: (value: string) => void;
  readonly onAccountBlur?: () => void;
  readonly onUnitNumberChange?: (value: string) => void;
  readonly onUnitCurrencyChange?: (value: string) => void;
  readonly onFlagChange?: (value: string) => void;
  readonly onCostNumberChange?: (value: string) => void;
  readonly onCostCurrencyChange?: (value: string) => void;
  readonly onCostDateChange?: (value: string) => void;
  readonly onCostLabelChange?: (value: string) => void;
  readonly onCostModeChange?: (costMode: CostMode) => void;
  readonly onPriceNumberChange?: (value: string) => void;
  readonly onPriceCurrencyChange?: (value: string) => void;
  readonly onPriceModeChange?: (priceMode: PriceMode) => void;
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
  updateCounter?: number,
  onValueChange?: (value: string) => void
): AutoCompleteProps => {
  const [value, setValue] = useState<string>(inputValue ?? "");
  const [updateCounterValue, setUpdateCounterValue] = useState<number>(
    updateCounter ?? 0
  );
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [displayCandidates, setDisplayCandidates] = useState<boolean>(false);

  if (updateCounterValue !== (updateCounter ?? 0)) {
    setValue(inputValue);
    setUpdateCounterValue(updateCounter ?? 0);
    setDisplayCandidates(false);
  }

  const lowerTrimedValue = value.trim().toLowerCase();
  const matchedValues: Array<Candidate> = useMemo(
    () =>
      candidateValues
        .map((candidateValue) => {
          const matchedPieces = fuzzyMatch(candidateValue, lowerTrimedValue);
          if (matchedPieces === null) {
            return null;
          }
          return {
            value: candidateValue,
            matchedPieces,
          } as Candidate;
        })
        .filter(
          (candidate: Candidate | null): candidate is Candidate =>
            candidate !== null
        ),
    [lowerTrimedValue, candidateValues]
  );
  if (matchedValues.length === 0 && displayCandidates) {
    setDisplayCandidates(false);
  }
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
  unitCurrencyUpdateCounter,
  unitNumberError,
  flag,
  flagError,
  initialCostMode,
  costExpanded,
  costNumber,
  costNumberError,
  costCurrency,
  costCurrencyError,
  costCurrencyUpdateCounter,
  costDate,
  costDateError,
  costLabel,
  costLabelError,
  initialPriceMode,
  priceExpanded,
  priceNumber,
  priceNumberError,
  priceCurrency,
  priceCurrencyError,
  priceCurrencyUpdateCounter,
  accounts,
  currencies,
  advanced,
  name,
  onAccountChange,
  onAccountBlur,
  onUnitNumberChange,
  onUnitCurrencyChange,
  onFlagChange,
  onCostNumberChange,
  onCostCurrencyChange,
  onCostDateChange,
  onCostLabelChange,
  onCostModeChange,
  onPriceNumberChange,
  onPriceCurrencyChange,
  onPriceModeChange,
  onDelete,
}: Props) => {
  const [unitNumberValue, setUnitNumberValue] = useState<string>(
    unitNumber ?? ""
  );
  const [flagValue, setFlagValue] = useState<string>(flag ?? "");
  const [costMode, setCostMode] = useState<CostMode>(
    initialCostMode ?? CostMode.INACTIVE
  );
  const [costNumberValue, setCostNumberValue] = useState<string>(
    costNumber ?? ""
  );
  const [costDateValue, setCostDateValue] = useState<string>(costDate ?? "");
  const [costLabelValue, setCostLabelValue] = useState<string>(
    costLabel ?? ""
  );
  const [priceMode, setPriceMode] = useState<PriceMode>(
    initialPriceMode ?? PriceMode.INACTIVE
  );
  const [priceNumberValue, setPriceNumberValue] = useState<string>(
    priceNumber ?? ""
  );

  const accountProps = useAutoComplete(
    account ?? "",
    accounts,
    0,
    onAccountChange
  );
  const unitCurrencyProps = useAutoComplete(
    unitCurrency ?? "",
    currencies,
    unitCurrencyUpdateCounter,
    onUnitCurrencyChange
  );
  const costCurrencyProps = useAutoComplete(
    costCurrency ?? "",
    currencies,
    costCurrencyUpdateCounter,
    onCostCurrencyChange
  );
  const priceCurrencyProps = useAutoComplete(
    priceCurrency ?? "",
    currencies,
    priceCurrencyUpdateCounter,
    onPriceCurrencyChange
  );
  const setNextPriceMode = (nextMode: PriceMode) => {
    setPriceMode(nextMode);
    onPriceModeChange?.(nextMode);
  };
  const setNextCostMode = (nextMode: CostMode) => {
    setCostMode(nextMode);
    onCostModeChange?.(nextMode);
  };

  return (
    <PostingInput
      name={name}
      advanced={advanced}
      onDelete={onDelete}
      // Flag
      flag={flagValue}
      flagError={flagError}
      onFlagChange={(value) => {
        onFlagChange?.(value);
        setFlagValue(value);
      }}
      // Account value
      account={accountProps.value}
      accountError={accountError}
      accountCandidates={accountProps.candidates}
      accountCandidateIndex={accountProps.candidateIndex}
      onAccountChange={accountProps.onChange}
      onAccountKeyDown={accountProps.onKeyDown}
      onAccountKeyPress={accountProps.onKeyPress}
      onAccountCandidateClick={accountProps.onCandidateClick}
      onAccountBlur={() => {
        accountProps.onBlur();
        onAccountBlur?.();
      }}
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
      // Cost mode
      costMode={
        costMode === CostMode.INACTIVE
          ? costExpanded && !advanced
            ? CostMode.EXPANDED
            : costMode
          : costMode
      }
      onCostModeChange={setNextCostMode}
      // Cost number
      costNumber={costNumberValue}
      costNumberError={costNumberError}
      onCostNumberChange={(value) => {
        onCostNumberChange?.(value);
        setCostNumberValue(value);
      }}
      // Cost currency
      costCurrency={costCurrencyProps.value}
      costCurrencyCandidates={costCurrencyProps.candidates}
      costCurrencyCandidateIndex={costCurrencyProps.candidateIndex}
      costCurrencyError={costCurrencyError}
      onCostCurrencyChange={costCurrencyProps.onChange}
      onCostCurrencyKeyDown={costCurrencyProps.onKeyDown}
      onCostCurrencyKeyPress={costCurrencyProps.onKeyPress}
      onCostCurrencyCandidateClick={costCurrencyProps.onCandidateClick}
      onCostCurrencyBlur={costCurrencyProps.onBlur}
      // Cost date
      costDate={costDateValue}
      costDateError={costDateError}
      onCostDateChange={(value) => {
        onCostDateChange?.(value);
        setCostDateValue(value);
      }}
      // Cost label
      costLabel={costLabelValue}
      costLabelError={costLabelError}
      onCostLabelChange={(value) => {
        onCostLabelChange?.(value);
        setCostLabelValue(value);
      }}
      // Price mode
      priceMode={
        priceMode === PriceMode.INACTIVE
          ? priceExpanded && !advanced
            ? PriceMode.EXPANDED
            : priceMode
          : priceMode
      }
      onPriceModeChange={setNextPriceMode}
      onPriceButtonClick={() => {
        const options = [
          PriceMode.INACTIVE,
          PriceMode.PRICE,
          PriceMode.TOTAL_PRICE,
        ];
        const index = options.indexOf(priceMode);
        const nextMode = options[(index + 1) % options.length];
        setNextPriceMode(nextMode);
      }}
      // Price number
      priceNumber={priceNumberValue}
      priceNumberError={priceNumberError}
      onPriceNumberChange={(value) => {
        onPriceNumberChange?.(value);
        setPriceNumberValue(value);
      }}
      // Price currency
      priceCurrency={priceCurrencyProps.value}
      priceCurrencyCandidates={priceCurrencyProps.candidates}
      priceCurrencyCandidateIndex={priceCurrencyProps.candidateIndex}
      priceCurrencyError={priceCurrencyError}
      onPriceCurrencyChange={priceCurrencyProps.onChange}
      onPriceCurrencyKeyDown={priceCurrencyProps.onKeyDown}
      onPriceCurrencyKeyPress={priceCurrencyProps.onKeyPress}
      onPriceCurrencyCandidateClick={priceCurrencyProps.onCandidateClick}
      onPriceCurrencyBlur={priceCurrencyProps.onBlur}
    />
  );
};

export default PostingInputContainer;
