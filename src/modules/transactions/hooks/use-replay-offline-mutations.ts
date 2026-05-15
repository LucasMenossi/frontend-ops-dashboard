"use client";

import { useEffect, useRef, useState } from "react";

import { useOfflineMutationQueue } from "../store/use-offline-mutation-queue";

import { useTransactionEntityStore } from "../store/use-transaction-entity-store";

import { useNetworkStatus } from "./use-network-status";

import { useReplayLeadership } from "./use-replay-leadership";

import { updateTransactionStatus } from "../services/update-transaction-status";

import { RUNTIME_TAB_ID } from "../utils/runtime-tab-id";
import {
  createConflictMetadata,
  createReplayMetadata,
  createSyncedMetadata,
} from "../utils/update-sync-metadata";
import { logOperation } from "../diagnostics/transaction-operation-log";

export const useReplayOfflineMutations = () => {
  const { isOnline } = useNetworkStatus();

  const { isLeader } = useReplayLeadership();

  const queue = useOfflineMutationQueue((state) => state.queue);

  const dequeue = useOfflineMutationQueue((state) => state.dequeue);

  const markAsProcessing = useOfflineMutationQueue(
    (state) => state.markAsProcessing,
  );

  const markAsFailed = useOfflineMutationQueue((state) => state.markAsFailed);

  const setTransactionMetadata = useTransactionEntityStore(
    (state) => state.setTransactionMetadata,
  );

  const replayingRef = useRef(false);

  const [isReplaying, setIsReplaying] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    if (!isLeader) {
      return;
    }

    if (queue.length === 0) {
      return;
    }

    if (replayingRef.current) {
      return;
    }

    const replay = async () => {
      replayingRef.current = true;
      setIsReplaying(true);

      try {
        for (const mutation of queue) {
          if (mutation.state === "processing") {
            continue;
          }

          markAsProcessing(mutation.id);

          setTransactionMetadata(
            mutation.transactionId,
            createReplayMetadata(),
          );

          try {
            await updateTransactionStatus({
              transactionId: mutation.transactionId,

              status: mutation.status,
            });

            setTransactionMetadata(mutation.transactionId, {
              ...createSyncedMetadata(mutation.id),

              replayedAt: new Date().toISOString(),

              replaySourceTabId: RUNTIME_TAB_ID,
            });

            dequeue(mutation.id);

            logOperation({
              id: mutation.id,

              transactionId: mutation.transactionId,

              type: "replay",

              createdAt: new Date().toISOString(),
            });
          } catch {
            markAsFailed(mutation.id);

            setTransactionMetadata(
              mutation.transactionId,
              createConflictMetadata(),
            );

            logOperation({
              id: mutation.id,

              transactionId: mutation.transactionId,

              type: "rollback",

              createdAt: new Date().toISOString(),
            });
          }
        }
      } finally {
        replayingRef.current = false;
        setIsReplaying(false);
      }
    };

    replay();
  }, [
    queue,
    dequeue,
    markAsFailed,
    markAsProcessing,
    isOnline,
    isLeader,
    setTransactionMetadata,
  ]);

  return {
    isReplaying,
  };
};
