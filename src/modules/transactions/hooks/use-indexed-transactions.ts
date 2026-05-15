import { useMemo } from "react";

import { useTransactionEntityStore } from "../store/use-transaction-entity-store";
import { Transaction, TransactionsQueryParams } from "../types/transactions";
import { sortTransactions } from "../projections/sort-transactions";

interface UseIndexedTransactionsParams {
  queryParams: TransactionsQueryParams;
}

export const useIndexedTransactions = ({
  queryParams,
}: UseIndexedTransactionsParams) => {
  const entities = useTransactionEntityStore((state) => state.entities);

  const statusIndexes = useTransactionEntityStore(
    (state) => state.indexes.byStatus,
  );

  return useMemo(() => {
    let transactionIds: string[] | null = null;

    if (queryParams.status.length > 0) {
      const merged = new Set<string>();

      queryParams.status.forEach((status) => {
        const ids = statusIndexes.get(status);

        ids?.forEach((id) => {
          merged.add(id);
        });
      });

      transactionIds = Array.from(merged);
    }

    transactionIds ??= Array.from(entities.keys());

    const transactions = transactionIds
      .map((id) => entities.get(id))
      .filter(
        (transaction): transaction is Transaction => transaction !== undefined,
      );

    const filtered = transactions.filter((transaction) => {
      if (!queryParams.search) {
        return true;
      }

      const normalized = queryParams.search.toLowerCase();

      return (
        transaction.customerName.toLowerCase().includes(normalized) ||
        transaction.email.toLowerCase().includes(normalized)
      );
    });

    const sorted = sortTransactions(filtered, queryParams);
    const start = (queryParams.page - 1) * queryParams.pageSize;
    const end = start + queryParams.pageSize;
    const paginated = sorted.slice(start, end);

    return {
      transactionIds: paginated.map((transaction) => transaction.id),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / queryParams.pageSize),
    };
  }, [entities, statusIndexes, queryParams]);
};
