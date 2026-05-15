import { TransactionStatus } from "../types";

interface UpdateTransactionStatusParams {
  transactionId: string;
  status: TransactionStatus;
}

export const updateTransactionStatus = async ({
  transactionId,
  status,
}: UpdateTransactionStatusParams) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const shouldFail = Math.random() > 0.8;

  if (shouldFail) {
    throw new Error("Failed to update transaction");
  }

  return {
    transactionId,
    status,
  };
};
