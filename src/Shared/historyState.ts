/** Helpers for draft form values stored in `window.history.state`. */

export function readHistoryState(): Record<string, unknown> {
  const state = typeof window !== "undefined" ? window.history.state : null;
  if (state == null || typeof state !== "object") {
    return {};
  }
  return state as Record<string, unknown>;
}

export function getHistoryValue<T>(key: string): T | undefined {
  const state = readHistoryState();
  if (!(key in state)) {
    return undefined;
  }
  return state[key] as T;
}

export function setHistoryValue(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }
  window.history.replaceState(
    {
      ...readHistoryState(),
      [key]: value,
    },
    ""
  );
}

export function mergeHistoryState(patch: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }
  window.history.replaceState(
    {
      ...readHistoryState(),
      ...patch,
    },
    ""
  );
}
