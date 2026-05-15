export const RUNTIME_TAB_ID =
  typeof crypto === "undefined"
    ? Math.random().toString(36).slice(2)
    : crypto.randomUUID();
