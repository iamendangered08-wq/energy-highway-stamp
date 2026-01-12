export const TOTAL = 7;
const KEY = "eh_stamp_v2";

export type StampState = Record<number, { at: string }>;

export function loadState(): StampState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveState(state: StampState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function countDone(state: StampState) {
  let c = 0;
  for (let i = 1; i <= TOTAL; i++) if (state[i]) c++;
  return c;
}

export function addStamp(n: number) {
  const state = loadState();
  if (!state[n]) {
    state[n] = { at: new Date().toISOString() };
    saveState(state);
  }
  return state;
}

export function resetStamps() {
  localStorage.removeItem(KEY);
}
