import { create } from "zustand";

import { Transaction, TransactionStatus } from "../types/transactions";
import { reconcileTransaction } from "../reconciliation/reconcile-transaction";
import { reconcileTransactionPatch } from "../reconciliation/reconcile-transaction-patch";
import { TransactionEntityMetadata } from "../types/entity-metadata";

interface TransactionIndexes {
  byStatus: Map<TransactionStatus, Set<string>>;
}

interface PatchTransactionParams {
  transactionId: string;
  patch: Partial<Transaction>;
}

type TransactionMetadataMap = Map<string, TransactionEntityMetadata>;

interface TransactionEntityStore {
  entities: Map<string, Transaction>;
  indexes: TransactionIndexes;
  metadata: TransactionMetadataMap;
  upsertTransactions: (transactions: Transaction[]) => void;
  patchTransaction: (params: PatchTransactionParams) => void;
  removeTransaction: (transactionId: string) => void;
  setTransactionMetadata: (
    transactionId: string,
    metadata: Partial<TransactionEntityMetadata>,
  ) => void;
  clearTransactionMetadata: (transactionId: string) => void;
}

const createStatusIndex = (): TransactionIndexes["byStatus"] => {
  return new Map([
    ["pending", new Set()],
    ["processing", new Set()],
    ["completed", new Set()],
    ["failed", new Set()],
    ["refunded", new Set()],
  ]);
};

const cloneIndexes = (indexes: TransactionIndexes): TransactionIndexes => {
  const nextIndexes = {
    byStatus: createStatusIndex(),
  };

  indexes.byStatus.forEach((ids, status) => {
    nextIndexes.byStatus.set(status, new Set(ids));
  });

  return nextIndexes;
};

const createDefaultMetadata = (): TransactionEntityMetadata => {
  return {
    isDirty: false,
    syncState: "synced",
    pendingMutationId: null,
    lastMutationId: null,
    optimisticVersion: null,
    replayedAt: null,
    replaySourceTabId: null,
    lastSyncedAt: null,
  };
};

const resolveOptimisticMetadata = (
  existingMetadata: TransactionEntityMetadata | undefined,
  shouldFinalizeOptimistic: boolean,
) => {
  if (shouldFinalizeOptimistic) {
    return {
      syncState: "synced" as const,
      isDirty: false,
      optimisticVersion: null,
      pendingMutationId: null,
    };
  }

  return {
    syncState: existingMetadata?.syncState ?? "synced",
    isDirty: existingMetadata?.isDirty ?? false,
    optimisticVersion: existingMetadata?.optimisticVersion ?? null,
    pendingMutationId: existingMetadata?.pendingMutationId ?? null,
  };
};

const reconcileTransactionMetadata = ({
  existingMetadata,
  shouldFinalizeOptimistic,
}: {
  existingMetadata: TransactionEntityMetadata | undefined;
  shouldFinalizeOptimistic: boolean;
}): TransactionEntityMetadata => {
  return {
    ...createDefaultMetadata(),
    ...existingMetadata,
    ...resolveOptimisticMetadata(existingMetadata, shouldFinalizeOptimistic),
    lastSyncedAt: new Date().toISOString(),
  };
};

export const useTransactionEntityStore = create<TransactionEntityStore>(
  (set) => ({
    entities: new Map(),

    indexes: {
      byStatus: createStatusIndex(),
    },

    metadata: new Map(),

    upsertTransactions: (transactions) => {
      set((state) => {
        const nextEntities = new Map(state.entities);
        const nextIndexes = cloneIndexes(state.indexes);
        const nextMetadata = new Map(state.metadata);

        transactions.forEach((transaction) => {
          const current = nextEntities.get(transaction.id);
          const metadata = state.metadata.get(transaction.id);

          const reconciliation = reconcileTransaction({
            current,
            incoming: transaction,
            metadata,
          });

          const reconciled = reconciliation.transaction;

          if (current) {
            nextIndexes.byStatus.get(current.status)?.delete(transaction.id);
          }

          nextEntities.set(transaction.id, reconciled);

          nextIndexes.byStatus.get(reconciled.status)?.add(transaction.id);

          const existingMetadata = nextMetadata.get(transaction.id);

          nextMetadata.set(
            transaction.id,
            reconcileTransactionMetadata({
              existingMetadata,
              shouldFinalizeOptimistic: reconciliation.shouldFinalizeOptimistic,
            }),
          );
        });

        return {
          entities: nextEntities,
          indexes: nextIndexes,
          metadata: nextMetadata,
        };
      });
    },

    patchTransaction: ({ transactionId, patch }) => {
      set((state) => {
        const current = state.entities.get(transactionId);

        if (!current) {
          return state;
        }

        const nextTransaction = reconcileTransactionPatch({
          current,
          patch,
        });

        const nextEntities = new Map(state.entities);

        const nextIndexes = cloneIndexes(state.indexes);

        if (current.status !== nextTransaction.status) {
          nextIndexes.byStatus.get(current.status)?.delete(transactionId);

          nextIndexes.byStatus.get(nextTransaction.status)?.add(transactionId);
        }

        nextEntities.set(transactionId, nextTransaction);

        return {
          entities: nextEntities,
          indexes: nextIndexes,
        };
      });
    },

    setTransactionMetadata: (transactionId, metadata) => {
      set((state) => {
        const nextMetadata = new Map(state.metadata);

        const current =
          nextMetadata.get(transactionId) ?? createDefaultMetadata();

        nextMetadata.set(transactionId, {
          ...current,
          ...metadata,
        });

        return {
          metadata: nextMetadata,
        };
      });
    },

    clearTransactionMetadata: (transactionId) => {
      set((state) => {
        const nextMetadata = new Map(state.metadata);

        nextMetadata.set(transactionId, createDefaultMetadata());

        return {
          metadata: nextMetadata,
        };
      });
    },

    removeTransaction: (transactionId) => {
      set((state) => {
        const nextEntities = new Map(state.entities);
        const nextIndexes = cloneIndexes(state.indexes);
        const nextMetadata = new Map(state.metadata);
        const existing = nextEntities.get(transactionId);

        if (existing) {
          nextIndexes.byStatus.get(existing.status)?.delete(transactionId);
        }

        nextEntities.delete(transactionId);

        nextMetadata.delete(transactionId);

        return {
          entities: nextEntities,
          indexes: nextIndexes,
          metadata: nextMetadata,
        };
      });
    },
  }),
);
