import { Transaction } from "../types";

export const createOptimisticTransactionPatch = (
  current: Transaction,
  status: Transaction["status"],
): Partial<Transaction> => ({
  status,

  version: current.version + 1,

  updatedAt: new Date().toISOString(),
});
