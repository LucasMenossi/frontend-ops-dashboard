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
      className="
        rounded-full
        bg-yellow-100
        px-2
        py-1
        text-xs
        text-yellow-700
      "
    >
      {label}
    </span>
  );
};

export const NormalizedTransactionRow = memo(
  ({ transactionId }: NormalizedTransactionRowProps) => {
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

    return (
      <tr className="border-b">
        {/* checkbox */}

        <td className="p-4">
          <input
            checked={isSelected}
            onChange={() => toggleRow(transactionId)}
          />
        </td>

        <td className="p-4 text-sm">{transaction.customerName}</td>

        <td className="p-4 text-sm">{transaction.email}</td>

        <td className="p-4 text-sm">${transaction.amount}</td>

        <td className="p-4 text-sm">
          <div className="flex items-center gap-2">
            <span>{transaction.status}</span>

            {metadata?.syncState === "optimistic" && <Badge label="Syncing" />}

            {metadata?.syncState === "replaying" && <Badge label="Replay" />}

            {metadata?.syncState === "conflicted" && <Badge label="Conflict" />}
          </div>
        </td>

        <td className="p-4 text-sm">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </td>

        {/* actions */}

        <td className="p-4">
          <button
            onClick={() => {
              const nextStatus =
                transaction.status === "completed" ? "pending" : "completed";

              updateTransactionMutation.mutate({
                transactionId,

                status: nextStatus,
              });
            }}
            disabled={
              updateTransactionMutation.isPending &&
              updateTransactionMutation.variables?.transactionId ===
                transactionId
            }
            className=" rounded border px-3 py-1 text-xs disabled:opacity-50"
          >
            {updateTransactionMutation.isPending &&
            updateTransactionMutation.variables?.transactionId === transactionId
              ? "Updating..."
              : "Update"}
          </button>
        </td>
      </tr>
    );
  },
);

NormalizedTransactionRow.displayName = "NormalizedTransactionRow";
