import { faker } from "@faker-js/faker";

import { Transaction, TransactionStatus } from "../types/transactions";

export const TRANSACTION_STATUSES: TransactionStatus[] = [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
];

export const CURRENCIES = ["USD", "EUR", "BRL"] as const;

const STATUS_WEIGHTS: Record<TransactionStatus, number> = {
  completed: 60,
  processing: 20,
  pending: 10,
  failed: 7,
  refunded: 3,
};

const weightedStatuses = Object.entries(STATUS_WEIGHTS).flatMap(
  ([status, weight]) =>
    Array.from({ length: weight }, () => status as TransactionStatus),
);

const generateTransactionStatus = (): TransactionStatus => {
  return faker.helpers.arrayElement(weightedStatuses);
};

const generateAmount = () => {
  return Number(
    faker.finance.amount({
      min: 20,
      max: 5000,
      dec: 2,
    }),
  );
};

const generateCurrency = () => {
  return faker.helpers.arrayElement(CURRENCIES);
};

export const transactions: Transaction[] = Array.from({ length: 500 }, () => ({
  id: faker.string.uuid(),
  customerName: faker.person.fullName(),
  email: faker.internet.email(),
  amount: generateAmount(),
  currency: generateCurrency(),
  status: generateTransactionStatus(),
  version: 1,
  createdAt: faker.date
    .between({ from: "2025-01-01", to: new Date() })
    .toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));
