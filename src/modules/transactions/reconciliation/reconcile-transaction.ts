import { Transaction } from "../types";

import { TransactionEntityMetadata } from "../types/entity-metadata";

interface ReconcileTransactionParams {
  current?: Transaction;

  incoming: Transaction;

  metadata?: TransactionEntityMetadata;
}

export interface ReconcileTransactionResult {
  transaction: Transaction;

  shouldFinalizeOptimistic: boolean;
}

export const reconcileTransaction = ({
  current,
  incoming,
  metadata,
}: ReconcileTransactionParams): ReconcileTransactionResult => {
  /*
   * NEW ENTITY
   */

  if (!current) {
    return {
      transaction: incoming,

      shouldFinalizeOptimistic: false,
    };
  }

  /*
   * OPTIMISTIC OWNERSHIP
   */

  if (
    metadata?.syncState === "optimistic" &&
    metadata.optimisticVersion !== null
  ) {
    /*
     * STALE REMOTE UPDATE
     */

    if (incoming.version < metadata.optimisticVersion) {
      return {
        transaction: current,

        shouldFinalizeOptimistic: false,
      };
    }

    /*
     * SERVER CAUGHT UP
     */

    if (incoming.version >= metadata.optimisticVersion) {
      return {
        transaction: incoming,

        shouldFinalizeOptimistic: true,
      };
    }
  }

  /*
   * VERSION PRECEDENCE
   */

  if (incoming.version > current.version) {
    return {
      transaction: incoming,

      shouldFinalizeOptimistic: false,
    };
  }

  if (incoming.version < current.version) {
    return {
      transaction: current,

      shouldFinalizeOptimistic: false,
    };
  }

  /*
   * SAME VERSION
   */

  const currentUpdatedAt = new Date(current.updatedAt).getTime();

  const incomingUpdatedAt = new Date(incoming.updatedAt).getTime();

  if (incomingUpdatedAt > currentUpdatedAt) {
    return {
      transaction: incoming,

      shouldFinalizeOptimistic: false,
    };
  }

  return {
    transaction: current,

    shouldFinalizeOptimistic: false,
  };
};
