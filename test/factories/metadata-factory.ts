import { TransactionEntityMetadata } from "@/modules/transactions/types/entity-metadata";

export const createMetadata = (
  overrides: Partial<TransactionEntityMetadata> = {},
): TransactionEntityMetadata => ({
  isDirty: false,

  syncState: "synced",

  pendingMutationId: null,

  lastMutationId: null,

  optimisticVersion: null,

  replayedAt: null,

  replaySourceTabId: null,

  lastSyncedAt: null,

  ...overrides,
});
