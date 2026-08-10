import { v4 as uuid } from "uuid";
import { MetaRecord } from "./MetaListContainer";

export interface MetaRecordState {
  readonly key: string;
  readonly metaKey: string;
  readonly metaKeyError?: string;
  readonly metaKeyReadonly?: boolean;
  readonly metaValue: string;
  readonly metaValueError?: string;
  readonly metaValueReadonly?: boolean;
}

function text(value: unknown): string {
  if (value == null) {
    return "";
  }
  return String(value);
}

/** Normalize history / server metadata rows into UI state (always has `key`). */
export function normalizeMetaState(item: unknown): MetaRecordState {
  const row = (item ?? {}) as Partial<MetaRecordState & MetaRecord> & {
    key?: string;
  };
  return {
    key: row.key && String(row.key).length > 0 ? String(row.key) : uuid(),
    metaKey: text(row.metaKey),
    metaKeyError: row.metaKeyError,
    metaKeyReadonly: row.metaKeyReadonly,
    metaValue: text(row.metaValue),
    metaValueError: row.metaValueError,
    metaValueReadonly: row.metaValueReadonly,
  };
}

export function normalizeMetaStates(items: unknown): Array<MetaRecordState> {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(normalizeMetaState);
}

export function metaStatesToRecords(
  items: Array<MetaRecordState>
): Array<MetaRecord> {
  return items.map((item) => ({
    metaKey: item.metaKey,
    metaKeyError: item.metaKeyError,
    metaKeyReadonly: item.metaKeyReadonly,
    metaValue: item.metaValue,
    metaValueError: item.metaValueError,
    metaValueReadonly: item.metaValueReadonly,
  }));
}

export const emptyMeta = (): MetaRecordState => normalizeMetaState({});
