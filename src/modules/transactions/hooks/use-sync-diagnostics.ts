import { useMemo } from "react";

import { useTransactionEntityStore } from "../store/use-transaction-entity-store";

export const useSyncDiagnostics = () => {
  const metadata = useTransactionEntityStore((state) => state.metadata);

  return useMemo(() => {
    let optimisticCount = 0;
    let replayingCount = 0;
    let conflictedCount = 0;
    let dirtyCount = 0;

    metadata.forEach((entityMetadata) => {
      if (entityMetadata.isDirty) {
        dirtyCount++;
      }

      switch (entityMetadata.syncState) {
        case "optimistic":
          optimisticCount++;
          break;

        case "replaying":
          replayingCount++;
          break;

        case "conflicted":
          conflictedCount++;
          break;

        default:
          break;
      }
    });

    return {
      optimisticCount,
      replayingCount,
      conflictedCount,
      dirtyCount,
    };
  }, [metadata]);
};
