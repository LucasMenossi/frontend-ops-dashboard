import { faker } from "@faker-js/faker";

import { transactions } from "../mocks/transaction";

import { TransactionRealtimeEvent } from "../types/realtime";

import { TransactionStatus } from "../types/transactions";

const listeners = new Set<(event: TransactionRealtimeEvent) => void>();

const STATUSES: TransactionStatus[] = [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
];

const emit = (event: TransactionRealtimeEvent) => {
  listeners.forEach((listener) => {
    listener(event);
  });
};

export const subscribeToTransactionEvents = (
  callback: (event: TransactionRealtimeEvent) => void,
) => {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
};

setInterval(() => {
  const randomTransaction = faker.helpers.arrayElement(transactions);

  const randomStatus = faker.helpers.arrayElement(STATUSES);

  randomTransaction.status = randomStatus;

  randomTransaction.version += 1;

  randomTransaction.updatedAt = new Date().toISOString();

  emit({
    type: "transaction.updated",

    payload: {
      transactionId: randomTransaction.id,

      status: randomStatus,

      version: randomTransaction.version,

      updatedAt: randomTransaction.updatedAt,
    },
  });
}, 4000);
