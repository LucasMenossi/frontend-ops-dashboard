import { Transaction, TransactionsQueryParams } from "../types";

export const sortTransactions = (
  transactions: Transaction[],
  queryParams: Pick<TransactionsQueryParams, "sortKey" | "direction">,
) => {
  const sorted = [...transactions];

  sorted.sort((a, b) => {
    const aValue = a[queryParams.sortKey];
    const bValue = b[queryParams.sortKey];

    if (queryParams.sortKey === "amount") {
      return queryParams.direction === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }

    if (queryParams.sortKey === "createdAt") {
      return queryParams.direction === "asc"
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    return queryParams.direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return sorted;
};
