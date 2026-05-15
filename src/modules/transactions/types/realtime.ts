import { Transaction, TransactionStatus } from "../types";

export type TransactionRealtimeEvent =
  | TransactionUpdatedEvent
  | TransactionCreatedEvent
  | TransactionDeletedEvent;

export interface TransactionUpdatedEvent {
  type: "transaction.updated";

  payload: {
    transactionId: string;

    status: TransactionStatus;

    version: number;

    updatedAt: string;
  };
}

export interface TransactionCreatedEvent {
  type: "transaction.created";

  payload: {
    transaction: Transaction;
  };
}

export interface TransactionDeletedEvent {
  type: "transaction.deleted";

  payload: {
    transactionId: string;
  };
}
