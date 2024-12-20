import React, { FunctionComponent, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import FormRow from "../Shared/FormRow";
import MetaInputContainer from "./MetaInputContainer";

export interface MetaRecord {
  readonly metaKey?: string;
  readonly metaKeyError?: string;
  readonly metaKeyReadonly?: boolean;
  readonly metaValue?: string;
  readonly metaValueError?: string;
  readonly metaValueReadonly?: boolean;
}

interface MetaRecordState {
  readonly key?: string;
  readonly metaKey: string;
  readonly metaKeyError?: string;
  readonly metaKeyReadonly?: boolean;
  readonly metaValue: string;
  readonly metaValueError?: string;
  readonly metaValueReadonly?: boolean;
}

export interface Props {
  readonly initialMeta?: Array<MetaRecord>;
}

const MetaListContainer: FunctionComponent<Props> = ({
  initialMeta,
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
    filledInitialMeta = [
      ...filledInitialMeta,
      {
        key: uuid(),
        metaKey: "",
        metaValue: "",
      } as MetaRecordState,
    ];
  }
  let initialState = (filledInitialMeta ?? [{}]).map(
    (item) =>
      ({
        key: uuid(),
        metaKey: item.metaKey,
        metaKeyError: item.metaKeyError,
        metaKeyReadonly: item.metaKeyReadonly,
        metaValue: item.metaValue,
        metaValueError: item.metaValueError,
        metaValueReadonly: item.metaValueReadonly,
      } as MetaRecordState)
  );
  if (window.history.state?.meta !== undefined) {
    initialState = window.history.state.meta;
  }
  useEffect(() => {
    if (window.history.state?.meta === undefined) {
      window.history.replaceState(
        {
          ...window.history.state,
          meta: initialState,
        },
        ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [metaState, setMetaState] = useState<Array<MetaRecordState>>(
    initialState
  );
  return (
    <FormRow title="Metadata">
      {metaState.map((metaItem, index) => (
        <MetaInputContainer
          key={metaItem.key}
          index={index}
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
              newMeta = [
                ...newMeta,
                {
                  key: uuid(),
                  metaKey: "",
                  metaValue: "",
                } as MetaRecordState,
              ];
            }
            setMetaState(newMeta);
            window.history.replaceState(
              {
                ...window.history.state,
                meta: newMeta,
              },
              ""
            );
          }}
          onValueChange={(metaValue) => {
            let newMeta = [...metaState];
            newMeta[index] = {
              ...newMeta[index],
              metaValue,
            };
            setMetaState(newMeta);
            window.history.replaceState(
              {
                ...window.history.state,
                meta: newMeta,
              },
              ""
            );
          }}
          onDelete={() => {
            const itemIndex = metaState.findIndex(
              (item) => item.key === metaItem.key
            );
            let newMeta;
            // Only one item left, clear it instead
            if (metaState.length <= 1) {
              newMeta = [
                {
                  key: uuid(),
                  metaKey: "",
                  metaValue: "",
                },
              ];
              // Deleting the last item, make it clear content of the last item instead
            } else if (itemIndex === metaState.length - 1) {
              newMeta = [
                ...metaState.slice(0, -1),
                {
                  key: uuid(),
                  metaKey: "",
                  metaValue: "",
                },
              ];
            } else {
              newMeta = metaState.filter((item) => item.key !== metaItem.key);
            }
            setMetaState(newMeta);
            window.history.replaceState(
              {
                ...window.history.state,
                meta: newMeta,
              },
              ""
            );
          }}
        />
      ))}
    </FormRow>
  );
};

export default MetaListContainer;
