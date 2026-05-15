import { Transaction } from "../types";

interface ReconcileTransactionPatchParams {
  current: Transaction;

  patch: Partial<Transaction>;
}

export const reconcileTransactionPatch = ({
  current,
  patch,
}: ReconcileTransactionPatchParams): Transaction => {
  const next: Transaction = {
    ...current,
    ...patch,
  };

  /*
   * PREVENT STALE PATCHES
   */

  if (patch.version !== undefined && patch.version < current.version) {
    return current;
  }

  return next;
};
