import { FunctionComponent, KeyboardEvent, useState } from "react";
import PostingCandidateList, { MatchedText } from "./PostingCandidateList";
import { isActiveCostMode, isActivePriceMode } from "./formMode";

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
  readonly advanced?: boolean;
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
  readonly onCostModeChange?: (costMode: CostMode) => void;
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
  readonly onPriceModeChange?: (priceMode: PriceMode) => void;
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
  readonly onFillRemaining?: () => void;
  readonly fillRemainingDisabled?: boolean;
  readonly onDelete?: () => void;
}

const fieldStyle = (error?: string) =>
  error !== undefined
    ? {
        zIndex: 1,
        position: "relative" as const,
      }
    : {};

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
  advanced,
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
  onCostModeChange,
  onCostNumberChange,
  onCostCurrencyChange,
  onCostCurrencyKeyPress,
  onCostCurrencyKeyDown,
  onCostCurrencyBlur,
  onCostCurrencyCandidateClick,
  onCostDateChange,
  onCostLabelChange,
  onPriceButtonClick,
  onPriceModeChange,
  onPriceNumberChange,
  onPriceCurrencyChange,
  onPriceCurrencyKeyPress,
  onPriceCurrencyKeyDown,
  onPriceCurrencyBlur,
  onPriceCurrencyCandidateClick,
  onFillRemaining,
  fillRemainingDisabled,
  onDelete,
}: Props) => {
  const isInvalid = [accountError, unitNumberError, unitCurrencyError].some(
    (value) => value !== undefined
  );
  const priceModeValue = priceMode ?? PriceMode.INACTIVE;
  const costModeValue = costMode ?? CostMode.INACTIVE;
  const costActive = isActiveCostMode(costModeValue);
  const priceActive = isActivePriceMode(priceModeValue);
  const hasAdvancedDetails =
    costActive ||
    priceActive ||
    (flag ?? "").trim().length > 0 ||
    flagError !== undefined ||
    costNumberError !== undefined ||
    costCurrencyError !== undefined ||
    costDateError !== undefined ||
    costLabelError !== undefined ||
    priceNumberError !== undefined ||
    priceCurrencyError !== undefined;
  const [detailsOpen, setDetailsOpen] = useState<boolean>(hasAdvancedDetails);

  const accountInput = (
    <div
      className={
        "form-control-wrapper position-relative" +
        (isInvalid ? " is-invalid" : "")
      }
      style={{ flex: 2 }}
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
          ...(accountCandidates !== undefined
            ? {
                borderBottomLeftRadius: 0,
              }
            : {}),
          ...fieldStyle(accountError),
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
  );

  const amountInputs = (
    <>
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
          ...fieldStyle(unitNumberError),
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
            ...fieldStyle(unitCurrencyError),
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
    </>
  );

  const fillRemainingButton =
    onFillRemaining !== undefined ? (
      <div className="input-group-append">
        <button
          type="button"
          className="btn btn-outline-default"
          onClick={onFillRemaining}
          disabled={fillRemainingDisabled}
          title="Fill remaining amount to balance"
          aria-label="Fill remaining amount to balance"
        >
          <i className="fal fa-equals"></i>
        </button>
      </div>
    ) : null;

  const deleteButton = (
    <div className="input-group-append">
      <button
        type="button"
        className="btn btn-outline-default"
        onClick={onDelete}
        title="Delete posting"
      >
        <i className="fal fa-trash-alt"></i>
      </button>
    </div>
  );

  const simplePriceControls = (
    <>
      <div className="input-group-append">
        <button
          type="button"
          style={{ width: "5em" }}
          className={
            "btn btn-outline-default" + (priceActive ? " active" : "")
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
          {priceActive ? (
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
              ...fieldStyle(priceNumberError),
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
                ...fieldStyle(priceCurrencyError),
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
    </>
  );

  if (!advanced) {
    return (
      <div>
        <div className="input-group">
          {accountInput}
          {amountInputs}
          {fillRemainingButton}
          {simplePriceControls}
          {deleteButton}
          {isInvalid ? (
            <div className="invalid-feedback">
              {[accountError, unitNumberError, unitCurrencyError]
                .filter((value) => value !== undefined)
                .join(", ")}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <div className="input-group">
        {accountInput}
        {amountInputs}
        {fillRemainingButton}
        <div className="input-group-append">
          <button
            type="button"
            className={"btn btn-outline-default" + (detailsOpen ? " active" : "")}
            title="Posting details"
            onClick={() => setDetailsOpen(!detailsOpen)}
          >
            Details
          </button>
        </div>
        {deleteButton}
        {isInvalid ? (
          <div className="invalid-feedback">
            {[accountError, unitNumberError, unitCurrencyError]
              .filter((value) => value !== undefined)
              .join(", ")}
          </div>
        ) : null}
      </div>
      {detailsOpen ? (
        <div
          className="border rounded p-2 mt-1"
          style={{ backgroundColor: "#fafafa" }}
        >
          <div className="form-row">
            <div className="form-group col-md-2 mb-2">
              <label className="small text-muted mb-1">Flag</label>
              <select
                className={
                  "form-control form-control-sm" +
                  (flagError !== undefined ? " is-invalid" : "")
                }
                name={`${name}-flag`}
                value={flag ?? ""}
                onChange={(event) => onFlagChange?.(event.target.value)}
                aria-label="Flag"
              >
                <option value="">None</option>
                <option value="*">*</option>
                <option value="!">!</option>
              </select>
              {flagError !== undefined ? (
                <div className="invalid-feedback">{flagError}</div>
              ) : null}
            </div>
            <div className="form-group col-md-5 mb-2">
              <label className="small text-muted mb-1">Cost</label>
              <select
                className="form-control form-control-sm"
                aria-label="Cost mode"
                value={
                  costActive
                    ? costModeValue
                    : costModeValue === CostMode.EXPANDED
                    ? CostMode.INACTIVE
                    : costModeValue
                }
                onChange={(event) =>
                  onCostModeChange?.(event.target.value as CostMode)
                }
              >
                <option value={CostMode.INACTIVE}>None</option>
                <option value={CostMode.COST}>Unit cost {"{}"}</option>
                <option value={CostMode.TOTAL_COST}>Total cost {"{{}}"}</option>
              </select>
              {costActive ? (
                <input
                  type="hidden"
                  name={`${name}-cost_mode`}
                  value={costModeValue}
                />
              ) : null}
            </div>
            <div className="form-group col-md-5 mb-2">
              <label className="small text-muted mb-1">Price</label>
              <select
                className="form-control form-control-sm"
                aria-label="Price mode"
                value={
                  priceActive
                    ? priceModeValue
                    : priceModeValue === PriceMode.EXPANDED
                    ? PriceMode.INACTIVE
                    : priceModeValue
                }
                onChange={(event) =>
                  onPriceModeChange?.(event.target.value as PriceMode)
                }
              >
                <option value={PriceMode.INACTIVE}>None</option>
                <option value={PriceMode.PRICE}>Unit price @</option>
                <option value={PriceMode.TOTAL_PRICE}>Total price @@</option>
              </select>
              {priceActive ? (
                <input
                  type="hidden"
                  name={`${name}-price_mode`}
                  value={priceModeValue}
                />
              ) : null}
            </div>
          </div>
          {costActive ? (
            <div className="form-row">
              <div className="form-group col-md-3 mb-2">
                <label className="small text-muted mb-1">Cost amount</label>
                <input
                  type="number"
                  aria-label="Cost Number"
                  className={
                    "form-control form-control-sm" +
                    (costNumberError !== undefined ? " is-invalid" : "")
                  }
                  placeholder="12.34"
                  name={`${name}-cost_number`}
                  value={costNumber}
                  onChange={(event) => onCostNumberChange?.(event.target.value)}
                />
                {costNumberError !== undefined ? (
                  <div className="invalid-feedback">{costNumberError}</div>
                ) : null}
              </div>
              <div className="form-group col-md-3 mb-2">
                <label className="small text-muted mb-1">Cost currency</label>
                <div className="form-control-wrapper position-relative">
                  <input
                    type="text"
                    aria-label="Cost Currency"
                    className={
                      "form-control form-control-sm" +
                      (costCurrencyError !== undefined ? " is-invalid" : "")
                    }
                    placeholder="USD"
                    name={`${name}-cost_currency`}
                    value={costCurrency}
                    onChange={(event) =>
                      onCostCurrencyChange?.(event.target.value)
                    }
                    onKeyPress={(event) => onCostCurrencyKeyPress?.(event)}
                    onKeyDown={(event) => onCostCurrencyKeyDown?.(event)}
                    onBlur={() => onCostCurrencyBlur?.()}
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
                      onClick={(value) =>
                        onCostCurrencyCandidateClick?.(value)
                      }
                    />
                  ) : null}
                </div>
                {costCurrencyError !== undefined ? (
                  <div className="invalid-feedback d-block">
                    {costCurrencyError}
                  </div>
                ) : null}
              </div>
              <div className="form-group col-md-3 mb-2">
                <label className="small text-muted mb-1">Cost date</label>
                <input
                  type="text"
                  aria-label="Cost Date"
                  className={
                    "form-control form-control-sm" +
                    (costDateError !== undefined ? " is-invalid" : "")
                  }
                  placeholder="YYYY-MM-DD"
                  name={`${name}-cost_date`}
                  value={costDate ?? ""}
                  onChange={(event) => onCostDateChange?.(event.target.value)}
                />
                {costDateError !== undefined ? (
                  <div className="invalid-feedback">{costDateError}</div>
                ) : null}
              </div>
              <div className="form-group col-md-3 mb-2">
                <label className="small text-muted mb-1">Cost label</label>
                <input
                  type="text"
                  aria-label="Cost Label"
                  className={
                    "form-control form-control-sm" +
                    (costLabelError !== undefined ? " is-invalid" : "")
                  }
                  placeholder="lot-a"
                  name={`${name}-cost_label`}
                  value={costLabel ?? ""}
                  onChange={(event) => onCostLabelChange?.(event.target.value)}
                />
                {costLabelError !== undefined ? (
                  <div className="invalid-feedback">{costLabelError}</div>
                ) : null}
              </div>
            </div>
          ) : null}
          {priceActive ? (
            <div className="form-row">
              <div className="form-group col-md-3 mb-0">
                <label className="small text-muted mb-1">Price amount</label>
                <input
                  type="number"
                  aria-label="Price Number"
                  className={
                    "form-control form-control-sm" +
                    (priceNumberError !== undefined ? " is-invalid" : "")
                  }
                  placeholder="12.34"
                  name={`${name}-price_number`}
                  value={priceNumber}
                  onChange={(event) => onPriceNumberChange?.(event.target.value)}
                />
                {priceNumberError !== undefined ? (
                  <div className="invalid-feedback">{priceNumberError}</div>
                ) : null}
              </div>
              <div className="form-group col-md-3 mb-0">
                <label className="small text-muted mb-1">Price currency</label>
                <div className="form-control-wrapper position-relative">
                  <input
                    type="text"
                    aria-label="Price Currency"
                    className={
                      "form-control form-control-sm" +
                      (priceCurrencyError !== undefined ? " is-invalid" : "")
                    }
                    placeholder="USD"
                    name={`${name}-price_currency`}
                    value={priceCurrency}
                    onChange={(event) =>
                      onPriceCurrencyChange?.(event.target.value)
                    }
                    onKeyPress={(event) => onPriceCurrencyKeyPress?.(event)}
                    onKeyDown={(event) => onPriceCurrencyKeyDown?.(event)}
                    onBlur={() => onPriceCurrencyBlur?.()}
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
                      onClick={(value) =>
                        onPriceCurrencyCandidateClick?.(value)
                      }
                    />
                  ) : null}
                </div>
                {priceCurrencyError !== undefined ? (
                  <div className="invalid-feedback d-block">
                    {priceCurrencyError}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default PostingInput;
