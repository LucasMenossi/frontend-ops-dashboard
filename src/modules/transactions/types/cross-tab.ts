import { Transaction } from "./transactions";

export type CrossTabEvent = TransactionPatchedEvent;

export interface TransactionPatchedEvent {
  type: "transaction.patched";

  payload: {
    transactionId: string;
    patch: Partial<Transaction>;
  };
}
