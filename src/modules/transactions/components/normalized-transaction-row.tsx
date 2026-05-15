"use client";

import { memo } from "react";

import { useTransactionEntity } from "../hooks/use-transaction-entity";
import { useTransactionMetadata } from "../hooks/use-transaction-metadata";
import { useUpdateTransactionStatus } from "../hooks/use-update-transaction-status";
import { useRowSelection } from "../hooks/use-row-selection";

interface NormalizedTransactionRowProps {
  transactionId: string;
}

interface BadgeProps {
  label: string;
}

const Badge = ({ label }: BadgeProps) => {
  return (
    <span
      className=" rounded-full  bg-yellow-100 px-2 py-1 text-xs  text-yellow-700
      "
    >
      {label}
    </span>
  );
};

const syncStateLabels = {
  optimistic: "Syncing",
  replaying: "Replay",
  conflicted: "Conflict",
} as const;

interface SyncBadgeProps {
  syncState?: string;
}

const getNextStatus = (status: string) => {
  return status === "completed" ? "pending" : "completed";
};

const SyncBadge = ({ syncState }: SyncBadgeProps) => {
  if (!syncState || !(syncState in syncStateLabels)) {
    return null;
  }

  return (
    <Badge label={syncStateLabels[syncState as keyof typeof syncStateLabels]} />
  );
};

const NormalizedTransactionRowComponent = ({
  transactionId,
}: NormalizedTransactionRowProps) => {
  const transaction = useTransactionEntity(transactionId);

  const metadata = useTransactionMetadata(transactionId);

  const isSelected = useRowSelection((state) =>
    state.selectedRows.has(transactionId),
  );

  const toggleRow = useRowSelection((state) => state.toggleRow);

  const updateTransactionMutation = useUpdateTransactionStatus();

  if (!transaction) {
    return null;
  }

  const isUpdating =
    updateTransactionMutation.isPending &&
    updateTransactionMutation.variables?.transactionId === transactionId;

  const handleUpdateStatus = () => {
    updateTransactionMutation.mutate({
      transactionId,
      status: getNextStatus(transaction.status),
    });
  };

  return (
    <tr className="border-b">
      <td className="p-4">
        <input checked={isSelected} onChange={() => toggleRow(transactionId)} />
      </td>

      <td className="p-4 text-sm">{transaction.customerName}</td>

      <td className="p-4 text-sm">{transaction.email}</td>

      <td className="p-4 text-sm">${transaction.amount}</td>

      <td className="p-4 text-sm">
        <div className="flex items-center gap-2">
          <span>{transaction.status}</span>

          <SyncBadge syncState={metadata?.syncState} />
        </div>
      </td>

      <td className="p-4 text-sm">
        {new Date(transaction.createdAt).toLocaleDateString()}
      </td>

      <td className="p-4">
        <button
          onClick={handleUpdateStatus}
          disabled={isUpdating}
          className="rounded border px-3 py-1 text-xs disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </td>
    </tr>
  );
};

export const NormalizedTransactionRow = memo(NormalizedTransactionRowComponent);

NormalizedTransactionRow.displayName = "NormalizedTransactionRow";
