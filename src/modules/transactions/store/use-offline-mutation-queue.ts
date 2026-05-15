import { create } from "zustand";

import { compactMutationQueue } from "../utils/compact-mutation-queue";

import {
  clearOfflineQueueStorage,
  loadOfflineQueue,
  saveOfflineQueue,
} from "../persistence/offline-queue-storage";

import { TransactionStatus } from "../types/transactions";

export type MutationState = "pending" | "processing" | "failed";

export interface QueuedMutation {
  id: string;

  transactionId: string;

  status: TransactionStatus;

  createdAt: string;

  state: MutationState;
}

interface OfflineMutationQueueStore {
  queue: QueuedMutation[];

  enqueue: (mutation: QueuedMutation) => void;

  dequeue: (mutationId: string) => void;

  clear: () => void;

  markAsProcessing: (mutationId: string) => void;

  markAsFailed: (mutationId: string) => void;
}

export const useOfflineMutationQueue = create<OfflineMutationQueueStore>(
  (set) => ({
    queue: loadOfflineQueue(),

    enqueue: (mutation) => {
      set((state) => {
        const compacted = compactMutationQueue([...state.queue, mutation]);

        saveOfflineQueue(compacted);

        return {
          queue: compacted,
        };
      });
    },

    dequeue: (mutationId) => {
      set((state) => {
        const nextQueue = state.queue.filter(
          (mutation) => mutation.id !== mutationId,
        );

        saveOfflineQueue(nextQueue);

        return {
          queue: nextQueue,
        };
      });
    },

    clear: () => {
      clearOfflineQueueStorage();

      set({
        queue: [],
      });
    },

    markAsProcessing: (mutationId) => {
      set((state) => {
        const nextQueue = state.queue.map((mutation) => {
          if (mutation.id !== mutationId) {
            return mutation;
          }

          const nextMutation: QueuedMutation = {
            ...mutation,
            state: "processing",
          };

          return nextMutation;
        });

        saveOfflineQueue(nextQueue);

        return {
          queue: nextQueue,
        };
      });
    },

    markAsFailed: (mutationId) => {
      set((state) => {
        const nextQueue = state.queue.map((mutation) => {
          if (mutation.id !== mutationId) {
            return mutation;
          }

          const nextMutation: QueuedMutation = {
            ...mutation,
            state: "failed",
          };

          return nextMutation;
        });

        saveOfflineQueue(nextQueue);

        return {
          queue: nextQueue,
        };
      });
    },
  }),
);
