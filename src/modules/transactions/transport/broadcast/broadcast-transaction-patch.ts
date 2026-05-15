import { transactionsBroadcastChannel } from "./broadcast-channel";

import { Transaction } from "../../types";

export interface BroadcastTransactionPatchParams {
  transactionId: string;
  patch: Partial<Transaction>;
}

export const broadcastTransactionPatch = ({
  transactionId,
  patch,
}: BroadcastTransactionPatchParams) => {
  transactionsBroadcastChannel?.postMessage({
    type: "transaction.patched",
    payload: {
      transactionId,
      patch,
    },
  });
};
