import { FunctionComponent, KeyboardEvent } from "react";
import PostingCandidateList, { MatchedText } from "./PostingCandidateList";

export enum PriceMode {
  INACTIVE = "INACTIVE",
  PRICE = "PRICE",
  TOTAL_PRICE = "TOTAL_PRICE",
  // Expanded to fill the space for layout but disabled
  EXPANDED = "EXPANDED",
}

export enum CostMode {
  INACTIVE = "INACTIVE",
  COST = "COST",
  TOTAL_COST = "TOTAL_COST",
  // Expanded to fill the space for layout but disabled
  EXPANDED = "EXPANDED",
}

export interface Candidate {
  readonly value: string;
  readonly matchedPieces: Array<MatchedText>;
}

export interface Props {
  readonly account: string;
  readonly accountCandidates?: Array<Candidate>;
  readonly accountCandidateIndex?: number;
  readonly accountError?: string;
  readonly unitNumber: string;
  readonly unitNumberError?: string;
  readonly unitCurrency: string;
  readonly unitCurrencyCandidates?: Array<Candidate>;
  readonly unitCurrencyCandidateIndex?: number;
  readonly unitCurrencyError?: string;
  readonly flag?: string;
  readonly flagError?: string;
  readonly costMode?: CostMode;
  readonly costNumber?: string;
  readonly costNumberError?: string;
  readonly costCurrency?: string;
  readonly costCurrencyCandidates?: Array<Candidate>;
  readonly costCurrencyCandidateIndex?: number;
  readonly costCurrencyError?: string;
  readonly costDate?: string;
  readonly costDateError?: string;
  readonly costLabel?: string;
  readonly costLabelError?: string;
  readonly priceMode?: PriceMode;
  readonly priceNumber?: string;
  readonly priceNumberError?: string;
  readonly priceCurrency?: string;
  readonly priceCurrencyCandidates?: Array<Candidate>;
  readonly priceCurrencyCandidateIndex?: number;
  readonly priceCurrencyError?: string;
  readonly name: string;
  readonly onAccountChange?: (value: string) => void;
  readonly onAccountKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void;
  readonly onAccountKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  readonly onAccountBlur?: () => void;
  readonly onAccountCandidateClick?: (value: string) => void;
  readonly onUnitNumberChange?: (value: string) => void;
  readonly onUnitCurrencyChange?: (value: string) => void;
  readonly onUnitCurrencyKeyPress?: (
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  readonly onUnitCurrencyKeyDown?: (
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  readonly onUnitCurrencyBlur?: () => void;
  readonly onUnitCurrencyCandidateClick?: (value: string) => void;
  readonly onFlagChange?: (value: string) => void;
  readonly onCostButtonClick?: () => void;
  readonly onCostNumberChange?: (value: string) => void;
  readonly onCostCurrencyChange?: (value: string) => void;
  readonly onCostCurrencyKeyPress?: (
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  readonly onCostCurrencyKeyDown?: (
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  readonly onCostCurrencyBlur?: () => void;
  readonly onCostCurrencyCandidateClick?: (value: string) => void;
  readonly onCostDateChange?: (value: string) => void;
  readonly onCostLabelChange?: (value: string) => void;
  readonly onPriceButtonClick?: () => void;
  readonly onPriceNumberChange?: (value: string) => void;
  readonly onPriceCurrencyChange?: (value: string) => void;
  readonly onPriceCurrencyKeyPress?: (
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  readonly onPriceCurrencyKeyDown?: (
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  readonly onPriceCurrencyBlur?: () => void;
  readonly onPriceCurrencyCandidateClick?: (value: string) => void;
  readonly onDelete?: () => void;
}

const PostingInput: FunctionComponent<Props> = ({
  account,
  accountCandidates,
  accountCandidateIndex,
  accountError,
  unitNumber,
  unitNumberError,
  unitCurrency,
  unitCurrencyCandidates,
  unitCurrencyCandidateIndex,
  unitCurrencyError,
  flag,
  flagError,
  costMode,
  costNumber,
  costNumberError,
  costCurrency,
  costCurrencyCandidates,
  costCurrencyCandidateIndex,
  costCurrencyError,
  costDate,
  costDateError,
  costLabel,
  costLabelError,
  priceMode,
  priceNumber,
  priceNumberError,
  priceCurrency,
  priceCurrencyCandidates,
  priceCurrencyCandidateIndex,
  priceCurrencyError,
  name,
  onAccountChange,
  onAccountKeyPress,
  onAccountKeyDown,
  onAccountBlur,
  onAccountCandidateClick,
  onUnitNumberChange,
  onUnitCurrencyChange,
  onUnitCurrencyKeyPress,
  onUnitCurrencyKeyDown,
  onUnitCurrencyBlur,
  onUnitCurrencyCandidateClick,
  onFlagChange,
  onCostButtonClick,
  onCostNumberChange,
  onCostCurrencyChange,
  onCostCurrencyKeyPress,
  onCostCurrencyKeyDown,
  onCostCurrencyBlur,
  onCostCurrencyCandidateClick,
  onCostDateChange,
  onCostLabelChange,
  onPriceButtonClick,
  onPriceNumberChange,
  onPriceCurrencyChange,
  onPriceCurrencyKeyPress,
  onPriceCurrencyKeyDown,
  onPriceCurrencyBlur,
  onPriceCurrencyCandidateClick,
  onDelete,
}: Props) => {
  const isInvalid = [accountError, unitNumberError, unitCurrencyError].some(
    (value) => value !== undefined
  );
  const priceModeValue = priceMode ?? PriceMode.INACTIVE;
  const costModeValue = costMode ?? CostMode.INACTIVE;
  const costActive = [CostMode.COST, CostMode.TOTAL_COST].includes(
    costModeValue
  );
  return (
    <div>
      <div className="input-group">
        <input
          type="text"
          aria-label="Flag"
          className={
            "form-control" + (flagError !== undefined ? " is-invalid" : "")
          }
          placeholder="*"
          name={`${name}-flag`}
          value={flag ?? ""}
          onChange={(event) => onFlagChange?.(event.target.value)}
          style={{
            flex: "0 0 2.5em",
            width: "2.5em",
            paddingLeft: "0.4em",
            paddingRight: "0.4em",
            ...(flagError !== undefined
              ? {
                  zIndex: 1,
                  position: "relative",
                }
              : {}),
          }}
          title="Posting flag (* or !)"
        />
        <div
          className={
            "form-control-wrapper position-relative" +
            (isInvalid ? " is-invalid" : "")
          }
          style={{ flex: 2, marginLeft: -1 }}
        >
          <input
            type="text"
            aria-label="Account"
            className={
              "form-control" + (accountError !== undefined ? " is-invalid" : "")
            }
            placeholder="Account"
            name={`${name}-account`}
            value={account}
            onChange={(event) => onAccountChange?.(event.target.value)}
            onKeyPress={(event) => onAccountKeyPress?.(event)}
            onKeyDown={(event) => onAccountKeyDown?.(event)}
            onBlur={() => onAccountBlur?.()}
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              ...(accountCandidates !== undefined
                ? {
                    borderBottomLeftRadius: 0,
                  }
                : {}),
              ...(accountError !== undefined
                ? {
                    zIndex: 1,
                    position: "relative",
                  }
                : {}),
            }}
          />
          {accountCandidates !== undefined ? (
            <PostingCandidateList
              style={{ position: "absolute", width: "100%", zIndex: 1 }}
              activeIndex={accountCandidateIndex ?? 0}
              candidates={accountCandidates.map(
                (item) =>
                  ({
                    value: item.value,
                    matchedPieces: item.matchedPieces,
                  } as Candidate)
              )}
              onClick={(value) => onAccountCandidateClick?.(value)}
            />
          ) : null}
        </div>
        <input
          type="number"
          aria-label="Unit Number"
          className={
            "form-control" + (unitNumberError !== undefined ? " is-invalid" : "")
          }
          placeholder="12.34"
          name={`${name}-number`}
          value={unitNumber}
          onChange={(event) => onUnitNumberChange?.(event.target.value)}
          style={{
            marginLeft: -1,
            ...(unitNumberError !== undefined
              ? {
                  zIndex: 1,
                  position: "relative",
                }
              : {}),
          }}
        />
        <div
          className="form-control-wrapper position-relative"
          style={{ marginLeft: -1, flex: 1 }}
        >
          <input
            type="text"
            aria-label="Unit Currency"
            className={
              "form-control" +
              (unitCurrencyError !== undefined ? " is-invalid" : "")
            }
            placeholder="USD"
            name={`${name}-currency`}
            value={unitCurrency}
            onChange={(event) => onUnitCurrencyChange?.(event.target.value)}
            onKeyPress={(event) => onUnitCurrencyKeyPress?.(event)}
            onKeyDown={(event) => onUnitCurrencyKeyDown?.(event)}
            onBlur={() => onUnitCurrencyBlur?.()}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              ...(unitCurrencyError !== undefined
                ? {
                    zIndex: 1,
                    position: "relative",
                  }
                : {}),
            }}
          />
          {unitCurrencyCandidates !== undefined ? (
            <PostingCandidateList
              style={{ position: "absolute", width: "100%", zIndex: 1 }}
              activeIndex={unitCurrencyCandidateIndex ?? 0}
              candidates={unitCurrencyCandidates.map(
                (item) =>
                  ({
                    value: item.value,
                    matchedPieces: item.matchedPieces,
                  } as Candidate)
              )}
              onClick={(value) => onUnitCurrencyCandidateClick?.(value)}
            />
          ) : null}
        </div>
        <div className="input-group-append">
          <button
            type="button"
            style={{ width: "5em" }}
            className={
              "btn btn-outline-default" +
              ([CostMode.COST, CostMode.TOTAL_COST].includes(costModeValue)
                ? " active"
                : "")
            }
            title={
              costModeValue === CostMode.TOTAL_COST ? "Total Cost" : "Cost"
            }
            onClick={onCostButtonClick}
          >
            {costModeValue === CostMode.TOTAL_COST ? "{{" : "{"}
          </button>
        </div>
        {costModeValue !== CostMode.INACTIVE ? (
          <>
            {costActive ? (
              <input
                type="hidden"
                name={`${name}-cost_mode`}
                value={costModeValue}
              />
            ) : null}
            <input
              type="number"
              aria-label="Cost Number"
              className={
                "form-control" +
                (costNumberError !== undefined ? " is-invalid" : "")
              }
              placeholder="12.34"
              name={`${name}-cost_number`}
              value={costNumber}
              onChange={(event) => onCostNumberChange?.(event.target.value)}
              disabled={costModeValue === CostMode.EXPANDED}
              style={{
                marginLeft: -1,
                ...(costNumberError !== undefined
                  ? {
                      zIndex: 1,
                      position: "relative",
                    }
                  : {}),
              }}
            />
            <div
              className="form-control-wrapper position-relative"
              style={{ marginLeft: -1, flex: 1 }}
            >
              <input
                type="text"
                aria-label="Cost Currency"
                className={
                  "form-control" +
                  (costCurrencyError !== undefined ? " is-invalid" : "")
                }
                placeholder="USD"
                name={`${name}-cost_currency`}
                value={costCurrency}
                disabled={costModeValue === CostMode.EXPANDED}
                onChange={(event) => onCostCurrencyChange?.(event.target.value)}
                onKeyPress={(event) => onCostCurrencyKeyPress?.(event)}
                onKeyDown={(event) => onCostCurrencyKeyDown?.(event)}
                onBlur={() => onCostCurrencyBlur?.()}
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  ...(costCurrencyError !== undefined
                    ? {
                        zIndex: 1,
                        position: "relative",
                      }
                    : {}),
                }}
              />
              {costCurrencyCandidates !== undefined ? (
                <PostingCandidateList
                  style={{ position: "absolute", width: "100%", zIndex: 1 }}
                  activeIndex={costCurrencyCandidateIndex ?? 0}
                  candidates={costCurrencyCandidates.map(
                    (item) =>
                      ({
                        value: item.value,
                        matchedPieces: item.matchedPieces,
                      } as Candidate)
                  )}
                  onClick={(value) => onCostCurrencyCandidateClick?.(value)}
                />
              ) : null}
            </div>
          </>
        ) : undefined}
        <div className="input-group-append">
          <button
            type="button"
            style={{ width: "5em" }}
            className={
              "btn btn-outline-default" +
              ([PriceMode.PRICE, PriceMode.TOTAL_PRICE].includes(priceModeValue)
                ? " active"
                : "")
            }
            title={
              priceModeValue === PriceMode.TOTAL_PRICE ? "Total Price" : "Price"
            }
            onClick={onPriceButtonClick}
          >
            {priceModeValue === PriceMode.TOTAL_PRICE ? "@@" : "@"}
          </button>
        </div>
        {priceModeValue !== PriceMode.INACTIVE ? (
          <>
            {[PriceMode.PRICE, PriceMode.TOTAL_PRICE].includes(
              priceModeValue
            ) ? (
              <input
                type="hidden"
                name={`${name}-price_mode`}
                value={priceModeValue}
              />
            ) : null}
            <input
              type="number"
              aria-label="Price Number"
              className={
                "form-control" +
                (priceNumberError !== undefined ? " is-invalid" : "")
              }
              placeholder="12.34"
              name={`${name}-price_number`}
              value={priceNumber}
              onChange={(event) => onPriceNumberChange?.(event.target.value)}
              disabled={priceModeValue === PriceMode.EXPANDED}
              style={{
                marginLeft: -1,
                ...(priceNumberError !== undefined
                  ? {
                      zIndex: 1,
                      position: "relative",
                    }
                  : {}),
              }}
            />
            <div
              className="form-control-wrapper position-relative"
              style={{ marginLeft: -1, flex: 1 }}
            >
              <input
                type="text"
                aria-label="Price Currency"
                className={
                  "form-control" +
                  (priceCurrencyError !== undefined ? " is-invalid" : "")
                }
                placeholder="USD"
                name={`${name}-price_currency`}
                value={priceCurrency}
                disabled={priceModeValue === PriceMode.EXPANDED}
                onChange={(event) => onPriceCurrencyChange?.(event.target.value)}
                onKeyPress={(event) => onPriceCurrencyKeyPress?.(event)}
                onKeyDown={(event) => onPriceCurrencyKeyDown?.(event)}
                onBlur={() => onPriceCurrencyBlur?.()}
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  ...(priceCurrencyError !== undefined
                    ? {
                        zIndex: 1,
                        position: "relative",
                      }
                    : {}),
                }}
              />
              {priceCurrencyCandidates !== undefined ? (
                <PostingCandidateList
                  style={{ position: "absolute", width: "100%", zIndex: 1 }}
                  activeIndex={priceCurrencyCandidateIndex ?? 0}
                  candidates={priceCurrencyCandidates.map(
                    (item) =>
                      ({
                        value: item.value,
                        matchedPieces: item.matchedPieces,
                      } as Candidate)
                  )}
                  onClick={(value) => onPriceCurrencyCandidateClick?.(value)}
                />
              ) : null}
            </div>
          </>
        ) : undefined}
        <div className="input-group-append">
          <button
            type="button"
            className="btn btn-outline-default"
            onClick={onDelete}
          >
            <i className="fal fa-trash-alt"></i>
          </button>
        </div>
        {isInvalid ? (
          <div className="invalid-feedback">
            {[accountError, unitNumberError, unitCurrencyError]
              .filter((value) => value !== undefined)
              .join(", ")}
          </div>
        ) : null}
      </div>
      {costActive ? (
        <div className="input-group" style={{ marginTop: -1 }}>
          <input
            type="text"
            aria-label="Cost Date"
            className={
              "form-control" +
              (costDateError !== undefined ? " is-invalid" : "")
            }
            placeholder="YYYY-MM-DD"
            name={`${name}-cost_date`}
            value={costDate ?? ""}
            onChange={(event) => onCostDateChange?.(event.target.value)}
            style={{
              ...(costDateError !== undefined
                ? {
                    zIndex: 1,
                    position: "relative",
                  }
                : {}),
            }}
          />
          <input
            type="text"
            aria-label="Cost Label"
            className={
              "form-control" +
              (costLabelError !== undefined ? " is-invalid" : "")
            }
            placeholder="Cost label"
            name={`${name}-cost_label`}
            value={costLabel ?? ""}
            onChange={(event) => onCostLabelChange?.(event.target.value)}
            style={{
              marginLeft: -1,
              ...(costLabelError !== undefined
                ? {
                    zIndex: 1,
                    position: "relative",
                  }
                : {}),
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PostingInput;
