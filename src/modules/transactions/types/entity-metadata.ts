export type EntitySyncState =
  | "synced"
  | "optimistic"
  | "replaying"
  | "conflicted";

export interface TransactionEntityMetadata {
  isDirty: boolean;

  syncState: EntitySyncState;

  pendingMutationId: string | null;

  lastMutationId: string | null;

  optimisticVersion: number | null;

  replayedAt: string | null;

  replaySourceTabId: string | null;

  lastSyncedAt: string | null;
}
