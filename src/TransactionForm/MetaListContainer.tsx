import React, { FunctionComponent, useState, useEffect } from "react";
import { getHistoryValue, setHistoryValue } from "../Shared/historyState";
import FormRow from "../Shared/FormRow";
import MetaInputContainer from "./MetaInputContainer";
import {
  emptyMeta,
  metaStatesToRecords,
  MetaRecordState,
  normalizeMetaStates,
} from "./metaState";

export interface MetaRecord {
  readonly metaKey?: string;
  readonly metaKeyError?: string;
  readonly metaKeyReadonly?: boolean;
  readonly metaValue?: string;
  readonly metaValueError?: string;
  readonly metaValueReadonly?: boolean;
}

export interface Props {
  readonly initialMeta?: Array<MetaRecord>;
  readonly required?: boolean;
  readonly error?: string;
  readonly name: string;
  readonly onChange?: (meta: Array<MetaRecord>) => void;
}

const MetaListContainer: FunctionComponent<Props> = ({
  initialMeta,
  required,
  error,
  name,
  onChange,
}: Props) => {
  let filledInitialMeta = initialMeta;
  if (
    filledInitialMeta !== undefined &&
    filledInitialMeta.filter(
      (item) =>
        (item.metaKey?.trim().length || 0) === 0 &&
        (item.metaValue?.trim().length || 0) === 0
    ).length <= 0
  ) {
    filledInitialMeta = [...filledInitialMeta, emptyMeta()];
  }
  let initialState = normalizeMetaStates(filledInitialMeta ?? [{}]);
  // Key by field `name` so multi-entry edit forms (and different pages) do not
  // clobber each other via a single global `history.state.meta` slot.
  // Always normalize — older drafts may be plain MetaRecord[] without keys.
  const historyMeta = getHistoryValue<unknown>(name);
  if (historyMeta !== undefined) {
    initialState = normalizeMetaStates(historyMeta);
  }
  useEffect(() => {
    if (getHistoryValue(name) === undefined) {
      setHistoryValue(name, initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [metaState, setMetaState] = useState<Array<MetaRecordState>>(
    initialState
  );
  const updateMeta = (newMeta: Array<MetaRecordState>) => {
    setMetaState(newMeta);
    setHistoryValue(name, newMeta);
    onChange?.(metaStatesToRecords(newMeta));
  };
  useEffect(() => {
    onChange?.(
      metaState.map((item) => ({
        metaKey: item.metaKey,
        metaValue: item.metaValue,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FormRow title="Metadata" required={required ?? false}>
      {metaState.map((metaItem, index) => (
        <MetaInputContainer
          key={metaItem.key}
          name={`${name}-${index}`}
          metaKey={metaItem.metaKey}
          metaKeyError={metaItem.metaKeyError}
          metaKeyReadonly={metaItem.metaKeyReadonly}
          metaValue={metaItem.metaValue}
          metaValueError={metaItem.metaValueError}
          metaValueReadonly={metaItem.metaValueReadonly}
          onKeyChange={(metaKey) => {
            let newMeta = [...metaState];
            newMeta[index] = {
              ...newMeta[index],
              metaKey,
            };
            if (
              newMeta.filter(
                (item) =>
                  item.metaKey.trim().length === 0 &&
                  item.metaValue.trim().length === 0
              ).length <= 0
            ) {
              // Append a new meta
              newMeta = [...newMeta, emptyMeta()];
            }
            updateMeta(newMeta);
          }}
          onValueChange={(metaValue) => {
            let newMeta = [...metaState];
            newMeta[index] = {
              ...newMeta[index],
              metaValue,
            };
            updateMeta(newMeta);
          }}
          onDelete={() => {
            const itemIndex = metaState.findIndex(
              (item) => item.key === metaItem.key
            );
            let newMeta;
            // Only one item left, clear it instead
            if (metaState.length <= 1) {
              newMeta = [emptyMeta()];
              // Deleting the last item, make it clear content of the last item instead
            } else if (itemIndex === metaState.length - 1) {
              newMeta = [...metaState.slice(0, -1), emptyMeta()];
            } else {
              newMeta = metaState.filter((item) => item.key !== metaItem.key);
            }
            updateMeta(newMeta);
          }}
        />
      ))}
      {error !== undefined ? (
        <div>
          <div className="is-invalid"></div>
          <div className="invalid-feedback">{error}</div>
        </div>
      ) : null}
    </FormRow>
  );
};

export default MetaListContainer;
