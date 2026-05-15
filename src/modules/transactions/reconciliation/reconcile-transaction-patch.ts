import { Transaction } from "../types/transactions";

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

  if (patch.version !== undefined && patch.version < current.version) {
    return current;
  }

  return next;
};
