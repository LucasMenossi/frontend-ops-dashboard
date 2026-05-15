import { TransactionsQueryParams } from "../types";

interface GetTransactionsResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const getTransactions = async (
  params: TransactionsQueryParams,
  signal?: AbortSignal,
): Promise<GetTransactionsResponse<any>> => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page));

  searchParams.set("pageSize", String(params.pageSize));

  if (params.search.trim()) {
    searchParams.set("search", params.search);
  }

  if (params.status.length) {
    searchParams.set("status", params.status.join(","));
  }

  searchParams.set("sortKey", params.sortKey);

  searchParams.set("direction", params.direction);

  const response = await fetch(`/api/transactions?${searchParams.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
};
