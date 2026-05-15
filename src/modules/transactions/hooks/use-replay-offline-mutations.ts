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

  /*
   * QUEUE STATE
   */

  const queue = useOfflineMutationQueue((state) => state.queue);

  const dequeue = useOfflineMutationQueue((state) => state.dequeue);

  const markAsProcessing = useOfflineMutationQueue(
    (state) => state.markAsProcessing,
  );

  const markAsFailed = useOfflineMutationQueue((state) => state.markAsFailed);

  /*
   * ENTITY METADATA
   */

  const setTransactionMetadata = useTransactionEntityStore(
    (state) => state.setTransactionMetadata,
  );

  /*
   * REPLAY LOCK
   */

  const replayingRef = useRef(false);

  /*
   * UI STATE
   */

  const [isReplaying, setIsReplaying] = useState(false);

  useEffect(() => {
    /*
     * NETWORK REQUIRED
     */

    if (!isOnline) {
      return;
    }

    /*
     * SINGLE REPLAY OWNER
     */

    if (!isLeader) {
      return;
    }

    /*
     * EMPTY QUEUE
     */

    if (queue.length === 0) {
      return;
    }

    /*
     * REPLAY ALREADY RUNNING
     */

    if (replayingRef.current) {
      return;
    }

    const replay = async () => {
      replayingRef.current = true;
      setIsReplaying(true);

      try {
        for (const mutation of queue) {
          /*
           * ALREADY PROCESSING
           */

          if (mutation.state === "processing") {
            continue;
          }

          /*
           * QUEUE STATE
           */

          markAsProcessing(mutation.id);

          /*
           * ENTITY STATE
           */

          setTransactionMetadata(
            mutation.transactionId,
            createReplayMetadata(),
          );

          try {
            /*
             * SERVER REPLAY
             */

            await updateTransactionStatus({
              transactionId: mutation.transactionId,

              status: mutation.status,
            });

            /*
             * FINALIZE ENTITY
             */

            setTransactionMetadata(mutation.transactionId, {
              ...createSyncedMetadata(mutation.id),

              replayedAt: new Date().toISOString(),

              replaySourceTabId: RUNTIME_TAB_ID,
            });

            /*
             * REMOVE QUEUE ITEM
             */

            dequeue(mutation.id);

            logOperation({
              id: mutation.id,

              transactionId: mutation.transactionId,

              type: "replay",

              createdAt: new Date().toISOString(),
            });
          } catch {
            /*
             * FAILED REPLAY
             */

            markAsFailed(mutation.id);

            /*
             * CONFLICT STATE
             */

            setTransactionMetadata(
              mutation.transactionId,
              createConflictMetadata(),
            );

            /*
             * OPERATION LOG
             */

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
