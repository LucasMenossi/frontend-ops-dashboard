import { useTransactionEntityStore } from "../store/use-transaction-entity-store";

import { Transaction } from "../types/transactions";

export const useTransactionEntity = (transactionId: string) =>
  useTransactionEntityStore((state): Transaction | undefined =>
    state.entities.get(transactionId),
  );
