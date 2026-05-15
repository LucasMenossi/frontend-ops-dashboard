"use client";

import { useMemo, useRef, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";

import { useQueryClient } from "@tanstack/react-query";

import { ActivityFeed } from "@/modules/activity/components/activity-feed";

import { NormalizedTransactionRow } from "@/modules/transactions/components/normalized-transaction-row";

import { useBulkUpdateTransactions } from "@/modules/transactions/hooks/use-bulk-update-transactions";

import { useTransactionRealtime } from "@/modules/transactions/hooks/use-transaction-realtime";

import { useTransactions } from "@/modules/transactions/hooks/use-transactions";

import { useTransactionsQueryState } from "@/modules/transactions/hooks/use-transactions-query-state";

import { usePendingRealtimeUpdates } from "@/modules/transactions/store/use-pending-realtime-updates";

import { Transaction, TransactionStatus } from "@/modules/transactions/types";
import { useIndexedTransactions } from "@/modules/transactions/hooks/user-indexed-transactions";
import { useOfflineMutationQueue } from "@/modules/transactions/store/use-offline-mutation-queue";
import { useNetworkStatus } from "@/modules/transactions/hooks/use-network-status";
import { useReplayOfflineMutations } from "@/modules/transactions/hooks/use-replay-offline-mutations";
import { useCrossTabTransactions } from "@/modules/transactions/hooks/use-cross-tab-transaction";
import { SyncDiagnosticsPanel } from "@/modules/transactions/components/sync-diagnostic-panel";
import { OperationLogPanel } from "@/components/operation-log-panel";

export default function TransactionsPage() {
  /*
   * QUERY STATE
   */

  const {
    queryParams,

    searchInput,

    setSearchInput,

    updatePagination,

    updateSorting,

    updateFilters,
  } = useTransactionsQueryState();

  /*
   * HYDRATE ENTITY STORE
   */

  useTransactions(queryParams);

  /*
   * REALTIME
   */

  useTransactionRealtime();
  useCrossTabTransactions();
  useOfflineMutationQueue();

  /*
   * DERIVED PROJECTION
   */

  const queue = useOfflineMutationQueue((state) => state.queue);
  const { isReplaying } = useReplayOfflineMutations();

  const { isOnline } = useNetworkStatus();

  const {
    transactionIds,

    total,

    totalPages,
  } = useIndexedTransactions({
    queryParams,
  });

  /*
   * QUERY CLIENT
   */

  const queryClient = useQueryClient();

  /*
   * REALTIME BANNER
   */

  const {
    hasPendingUpdates,

    setHasPendingUpdates,
  } = usePendingRealtimeUpdates();

  /*
   * MUTATIONS
   */

  const bulkUpdateMutation = useBulkUpdateTransactions();

  /*
   * ROW SELECTION
   */

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  /*
   * STABLE SELECTION HANDLERS
   */

  /*
   * TABLE COLUMNS
   */

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: "select",

        header: () => {
          const allSelected =
            transactionIds.length > 0 &&
            transactionIds.every((id) => selectedRows.has(id));

          return (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                setSelectedRows((prev) => {
                  const next = new Set(prev);

                  if (allSelected) {
                    transactionIds.forEach((id) => {
                      next.delete(id);
                    });
                  } else {
                    transactionIds.forEach((id) => {
                      next.add(id);
                    });
                  }

                  return next;
                });
              }}
            />
          );
        },

        cell: () => null,
      },

      {
        accessorKey: "customerName",

        header: () => (
          <button
            onClick={() => {
              const nextDirection =
                queryParams.sortKey === "customerName" &&
                queryParams.direction === "asc"
                  ? "desc"
                  : "asc";

              updateSorting("customerName", nextDirection);
            }}
          >
            Customer
          </button>
        ),
      },

      {
        accessorKey: "email",

        header: "Email",
      },

      {
        accessorKey: "amount",

        header: () => (
          <button
            onClick={() => {
              const nextDirection =
                queryParams.sortKey === "amount" &&
                queryParams.direction === "asc"
                  ? "desc"
                  : "asc";

              updateSorting("amount", nextDirection);
            }}
          >
            Amount
          </button>
        ),
      },

      {
        accessorKey: "status",

        header: () => (
          <button
            onClick={() => {
              const nextDirection =
                queryParams.sortKey === "status" &&
                queryParams.direction === "asc"
                  ? "desc"
                  : "asc";

              updateSorting("status", nextDirection);
            }}
          >
            Status
          </button>
        ),

        cell: () => null,
      },

      {
        accessorKey: "createdAt",

        header: () => (
          <button
            onClick={() => {
              const nextDirection =
                queryParams.sortKey === "createdAt" &&
                queryParams.direction === "asc"
                  ? "desc"
                  : "asc";

              updateSorting("createdAt", nextDirection);
            }}
          >
            Created At
          </button>
        ),
      },

      {
        id: "actions",

        header: "Actions",

        cell: () => null,
      },
    ],
    [
      queryParams.sortKey,

      queryParams.direction,

      selectedRows,

      transactionIds,

      updateSorting,
    ],
  );

  /*
   * TABLE
   */

  const table = useReactTable({
    data: [],

    columns,

    getCoreRowModel: getCoreRowModel(),
  });

  /*
   * VIRTUALIZATION
   */

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: transactionIds.length,

    getScrollElement: () => parentRef.current,

    estimateSize: () => 56,

    overscan: 10,
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-6 p-6">
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>

            <p className="text-sm text-zinc-500">Operations dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            {hasPendingUpdates && (
              <button
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["transactions"],
                  });

                  setHasPendingUpdates(false);
                }}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white"
              >
                Load New Updates
              </button>
            )}
          </div>
        </div>

        {isReplaying && (
          <div className="rounded-xl border border-green-300 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-900">
              Replaying Offline Changes
            </p>

            <p className="text-sm text-green-700">
              Synchronizing queued mutations...
            </p>
          </div>
        )}

        {!isOnline && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm font-medium text-yellow-900">Offline Mode</p>

            <p className="text-sm text-yellow-700">
              Changes are being queued locally.
            </p>
          </div>
        )}

        {queue.length > 0 && (
          <div className="rounded-xl border border-blue-300 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">Pending Sync</p>

            <p className="text-sm text-blue-700">
              {queue.length} queued mutation
              {queue.length > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* SEARCH */}

        <div>
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search customer or email..."
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* STATUS FILTERS */}

        <div className="flex flex-wrap gap-2">
          {["pending", "processing", "completed", "failed", "refunded"].map(
            (status) => {
              const isActive = queryParams.status.includes(
                status as TransactionStatus,
              );

              return (
                <button
                  key={status}
                  onClick={() => {
                    const nextStatus = isActive
                      ? queryParams.status.filter(
                          (currentStatus) => currentStatus !== status,
                        )
                      : [...queryParams.status, status as TransactionStatus];

                    updateFilters(nextStatus);
                  }}
                  className={`rounded-lg border px-4 py-2 text-sm capitalize transition-colors ${
                    isActive ? "border-black bg-black text-white" : "bg-white"
                  }`}
                >
                  {status}
                </button>
              );
            },
          )}
        </div>

        {/* BULK ACTIONS */}

        {selectedRows.size > 0 && (
          <div className="flex items-center justify-between rounded-xl border bg-zinc-50 p-4">
            <span className="text-sm font-medium">
              {selectedRows.size} selected
            </span>

            <button
              onClick={() => {
                bulkUpdateMutation.mutate(
                  {
                    transactionIds: Array.from(selectedRows),

                    status: "completed",
                  },
                  {
                    onSuccess: (_result, variables) => {
                      setSelectedRows((prev) => {
                        const next = new Set(prev);

                        variables.transactionIds.forEach((id) => {
                          next.delete(id);
                        });

                        return next;
                      });
                    },
                  },
                );
              }}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Mark as Completed
            </button>
          </div>
        )}

        <SyncDiagnosticsPanel />
        <OperationLogPanel />

        {/* TABLE */}

        <div
          ref={parentRef}
          className="h-[600px] overflow-auto rounded-xl border"
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-zinc-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b p-4 text-left text-sm font-medium"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {transactionIds.map((id) => (
                <NormalizedTransactionRow key={id} transactionId={id} />
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-500">Total: {total}</div>

          <div className="flex items-center gap-2">
            <button
              disabled={queryParams.page <= 1}
              onClick={() => updatePagination(queryParams.page - 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {queryParams.page} of {totalPages}
            </span>

            <button
              disabled={queryParams.page >= totalPages}
              onClick={() => updatePagination(queryParams.page + 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ActivityFeed />
    </div>
  );
}
