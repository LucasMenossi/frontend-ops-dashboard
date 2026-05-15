import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bulkUpdateTransactions } from "../services/bulk-update-transactions";

import { useTransactionEntityStore } from "../store/use-transaction-entity-store";

import { broadcastTransactionPatch } from "../transport/broadcast/broadcast-transaction-patch";

import { createOptimisticTransactionPatch } from "../utils/transaction-operations";

import {
  createOptimisticMetadata,
  createSyncedMetadata,
} from "../utils/update-sync-metadata";

export const useBulkUpdateTransactions = () => {
  const queryClient = useQueryClient();

  const patchTransaction = useTransactionEntityStore(
    (state) => state.patchTransaction,
  );

  const entities = useTransactionEntityStore((state) => state.entities);

  const setTransactionMetadata = useTransactionEntityStore(
    (state) => state.setTransactionMetadata,
  );

  return useMutation({
    mutationFn: bulkUpdateTransactions,

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["transactions"],
      });

      const previous = new Map();

      const processedIds: string[] = [];

      variables.transactionIds.forEach((transactionId) => {
        const current = entities.get(transactionId);

        if (!current) {
          return;
        }

        /*
         * NO CHANGE
         */

        if (current.status === variables.status) {
          return;
        }

        processedIds.push(transactionId);

        previous.set(transactionId, current);

        const optimisticPatch = createOptimisticTransactionPatch(
          current,
          variables.status,
        );

        patchTransaction({
          transactionId,

          patch: optimisticPatch,
        });

        setTransactionMetadata(
          transactionId,

          createOptimisticMetadata(crypto.randomUUID(), current.version + 1),
        );

        broadcastTransactionPatch({
          transactionId,

          patch: optimisticPatch,
        });
      });

      return {
        previous,

        processedIds,
      };
    },

    onSuccess: (result, _variables, context) => {
      if (!context) {
        return;
      }

      const failedIds = new Set(result.failedIds);

      context.processedIds.forEach((transactionId) => {
        if (failedIds.has(transactionId)) {
          const previous = context.previous.get(transactionId);

          if (!previous) {
            return;
          }

          patchTransaction({
            transactionId,
            patch: previous,
          });

          setTransactionMetadata(transactionId, createSyncedMetadata());
        }

        setTransactionMetadata(transactionId, createSyncedMetadata());
      });
    },

    onError: (_error, _variables, context) => {
      context?.processedIds.forEach((transactionId) => {
        const previous = context.previous.get(transactionId);

        if (!previous) {
          return;
        }

        patchTransaction({
          transactionId,
          patch: previous,
        });

        setTransactionMetadata(transactionId, createSyncedMetadata());
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });
};
