const CHANNEL_NAME = "transactions-sync";

export const transactionsBroadcastChannel =
  globalThis.window === undefined ? null : new BroadcastChannel(CHANNEL_NAME);
