export type EntitySyncState =
  | "synced"
  | "optimistic"
  | "replaying"
  | "conflicted";

export interface TransactionEntityMetadata {
  /*
   * SYNC STATE
   */

  isDirty: boolean;

  syncState: EntitySyncState;

  /*
   * MUTATION OWNERSHIP
   */

  pendingMutationId: string | null;

  lastMutationId: string | null;

  /*
   * VERSION OWNERSHIP
   */

  optimisticVersion: number | null;

  /*
   * REPLAY PROVENANCE
   */

  replayedAt: string | null;

  replaySourceTabId: string | null;

  /*
   * SERVER SYNC
   */

  lastSyncedAt: string | null;
}
