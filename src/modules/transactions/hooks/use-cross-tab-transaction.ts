"use client";

import { useEffect } from "react";

import { transactionsBroadcastChannel } from "../sync/broadcast/broadcast-channel";

import { CrossTabEvent } from "../types/cross-tab";

import { useTransactionEntityStore } from "../store/use-transaction-entity-store";

export const useCrossTabTransactions = () => {
  const patchTransaction = useTransactionEntityStore(
    (state) => state.patchTransaction,
  );

  useEffect(() => {
    if (!transactionsBroadcastChannel) {
      return;
    }

    const handleMessage = (event: MessageEvent<CrossTabEvent>) => {
      if (event.data.type === "transaction.patched") {
        patchTransaction({
          transactionId: event.data.payload.transactionId,

          patch: event.data.payload.patch,
        });
      }
    };

    transactionsBroadcastChannel.addEventListener("message", handleMessage);

    return () => {
      transactionsBroadcastChannel?.removeEventListener(
        "message",
        handleMessage,
      );
    };
  }, [patchTransaction]);
};
