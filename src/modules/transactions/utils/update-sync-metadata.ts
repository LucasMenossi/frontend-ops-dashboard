import { TransactionEntityMetadata } from "../types/entity-metadata";

export const createOptimisticMetadata = (
  mutationId: string,
  optimisticVersion: number,
): Partial<TransactionEntityMetadata> => ({
  isDirty: true,
  syncState: "optimistic",
  pendingMutationId: mutationId,
  lastMutationId: mutationId,
  optimisticVersion,
});

export const createSyncedMetadata = (
  mutationId: string | null = null,
): Partial<TransactionEntityMetadata> => ({
  isDirty: false,
  syncState: "synced",
  pendingMutationId: null,
  optimisticVersion: null,
  lastMutationId: mutationId,
  lastSyncedAt: new Date().toISOString(),
});

export const createConflictMetadata =
  (): Partial<TransactionEntityMetadata> => ({
    syncState: "conflicted",
    pendingMutationId: null,
  });

export const createReplayMetadata = (): Partial<TransactionEntityMetadata> => ({
  syncState: "replaying",
});
