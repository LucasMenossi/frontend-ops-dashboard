import { Transaction } from "@/modules/transactions/types/transactions";

export const createTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => ({
  id: "transaction-1",

  customerName: "John Doe",

  email: "john@example.com",

  amount: 100,

  currency: "USD",

  status: "pending",

  version: 1,

  createdAt: "2026-05-14T09:00:00Z",

  updatedAt: "2026-05-14T10:00:00Z",

  ...overrides,
});
