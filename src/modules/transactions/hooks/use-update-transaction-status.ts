import { useMutation, useQueryClient } from "@tanstack/react-query";

import { faker } from "@faker-js/faker";

import { updateTransactionStatus } from "../services/update-transaction-status";

import { useNetworkStatus } from "./use-network-status";

import { useOfflineMutationQueue } from "../store/use-offline-mutation-queue";

import { useTransactionEntityStore } from "../store/use-transaction-entity-store";

import { broadcastTransactionPatch } from "../sync/broadcast/broadcast-transaction-patch";

import { Transaction, TransactionStatus } from "../types/transactions";
import {
  createConflictMetadata,
  createOptimisticMetadata,
  createSyncedMetadata,
} from "../utils/update-sync-metadata";
import { createOptimisticTransactionPatch } from "../utils/transaction-operations";
import { logOperation } from "../diagnostics/transaction-operation-log";

interface UpdateTransactionStatusVariables {
  transactionId: string;

  status: TransactionStatus;
}

interface UpdateTransactionStatusContext {
  previous: Transaction | null;

  mutationId: string | null;
}

interface OfflineMutationResult {
  offline: true;
}

interface OnlineMutationResult {
  transactionId: string;

  status: TransactionStatus;
}

type UpdateTransactionStatusResult =
  | OfflineMutationResult
  | OnlineMutationResult;

export const useUpdateTransactionStatus = () => {
  const { isOnline } = useNetworkStatus();

  const queryClient = useQueryClient();

  const enqueue = useOfflineMutationQueue((state) => state.enqueue);

  const patchTransaction = useTransactionEntityStore(
    (state) => state.patchTransaction,
  );

  const entities = useTransactionEntityStore((state) => state.entities);

  const setTransactionMetadata = useTransactionEntityStore(
    (state) => state.setTransactionMetadata,
  );

  return useMutation<
    UpdateTransactionStatusResult,
    Error,
    UpdateTransactionStatusVariables,
    UpdateTransactionStatusContext
  >({
    mutationFn: async (variables): Promise<UpdateTransactionStatusResult> => {
      if (!isOnline) {
        return {
          offline: true,
        };
      }

      return updateTransactionStatus({
        transactionId: variables.transactionId,

        status: variables.status,
      });
    },

    onMutate: async (variables): Promise<UpdateTransactionStatusContext> => {
      await queryClient.cancelQueries({
        queryKey: ["transactions"],
      });

      const current = entities.get(variables.transactionId);

      if (!current) {
        return {
          previous: null,

          mutationId: null,
        };
      }

      const mutationId = faker.string.uuid();

      if (!isOnline) {
        enqueue({
          id: mutationId,

          transactionId: variables.transactionId,

          status: variables.status,

          createdAt: new Date().toISOString(),

          state: "pending",
        });
      }

      const optimisticPatch = createOptimisticTransactionPatch(
        current,
        variables.status,
      );

      patchTransaction({
        transactionId: variables.transactionId,

        patch: optimisticPatch,
      });

      setTransactionMetadata(
        variables.transactionId,
        createOptimisticMetadata(mutationId, current.version + 1),
      );

      broadcastTransactionPatch({
        transactionId: variables.transactionId,

        patch: optimisticPatch,
      });

      logOperation({
        id: mutationId,

        transactionId: variables.transactionId,

        type: "optimistic",

        createdAt: new Date().toISOString(),
      });

      return {
        previous: current,

        mutationId,
      };
    },

    onError: (_error, variables, context) => {
      if (!context?.previous) {
        return;
      }

      patchTransaction({
        transactionId: variables.transactionId,

        patch: context.previous,
      });

      setTransactionMetadata(variables.transactionId, createConflictMetadata());

      broadcastTransactionPatch({
        transactionId: variables.transactionId,

        patch: context.previous,
      });

      logOperation({
        id: context?.mutationId ?? crypto.randomUUID(),

        transactionId: variables.transactionId,

        type: "rollback",

        createdAt: new Date().toISOString(),
      });
    },

    onSuccess: (_result, variables, context) => {
      setTransactionMetadata(
        variables.transactionId,
        createSyncedMetadata(context?.mutationId),
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });
};
