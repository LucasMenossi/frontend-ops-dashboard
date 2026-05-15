import { useTransactionEntityStore } from "../store/use-transaction-entity-store";

import { TransactionEntityMetadata } from "../types/entity-metadata";

export const useTransactionMetadata = (transactionId: string) =>
  useTransactionEntityStore((state): TransactionEntityMetadata | undefined =>
    state.metadata.get(transactionId),
  );
