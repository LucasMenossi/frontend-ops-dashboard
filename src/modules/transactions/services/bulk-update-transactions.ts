import { TransactionStatus } from "../types/transactions";

interface BulkUpdateTransactionsParams {
  transactionIds: string[];
  status: TransactionStatus;
}

export const bulkUpdateTransactions = async ({
  transactionIds,
  status,
}: BulkUpdateTransactionsParams) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const failedIds = transactionIds.filter(() => Math.random() > 0.8);
  const successfulIds = transactionIds.filter((id) => !failedIds.includes(id));

  return {
    successfulIds,
    failedIds,
    status,
  };
};
