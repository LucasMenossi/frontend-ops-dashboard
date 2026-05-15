"use client";

import { useEffect } from "react";

import { subscribeToTransactionEvents } from "../services/transaction-realtime";

import { TransactionRealtimeEvent } from "../types/realtime";

import { usePendingRealtimeUpdates } from "../store/use-pending-realtime-updates";

import { useTransactionEntityStore } from "../store/use-transaction-entity-store";
import { broadcastTransactionPatch } from "../transport/broadcast/broadcast-transaction-patch";
import { Transaction } from "../types";
import { logOperation } from "../diagnostics/transaction-operation-log";

export const useTransactionRealtime = () => {
  const patchTransaction = useTransactionEntityStore(
    (state) => state.patchTransaction,
  );

  const setHasPendingUpdates = usePendingRealtimeUpdates(
    (state) => state.setHasPendingUpdates,
  );

  useEffect(() => {
    const unsubscribe = subscribeToTransactionEvents((event) => {
      handleRealtimeEvent({
        event,

        patchTransaction,

        setHasPendingUpdates,
      });
    });

    return unsubscribe;
  }, [patchTransaction, setHasPendingUpdates]);
};

interface HandleRealtimeEventParams {
  event: TransactionRealtimeEvent;

  patchTransaction: (params: {
    transactionId: string;

    patch: Partial<Transaction>;
  }) => void;

  setHasPendingUpdates: (value: boolean) => void;
}

const handleRealtimeEvent = ({
  event,
  patchTransaction,
  setHasPendingUpdates,
}: HandleRealtimeEventParams) => {
  switch (event.type) {
    case "transaction.updated": {
      setHasPendingUpdates(true);

      const realTimePatch = {
        status: event.payload.status,
        version: event.payload.version,
        updatedAt: event.payload.updatedAt,
      };

      patchTransaction({
        transactionId: event.payload.transactionId,
        patch: realTimePatch,
      });

      broadcastTransactionPatch({
        transactionId: event.payload.transactionId,
        patch: realTimePatch,
      });

      logOperation({
        id: crypto.randomUUID(),

        transactionId: event.payload.transactionId,

        type: "realtime",

        createdAt: new Date().toISOString(),
      });

      break;
    }

    default:
      break;
  }
};
