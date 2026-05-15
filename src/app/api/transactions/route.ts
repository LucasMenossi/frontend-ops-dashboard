import { NextRequest, NextResponse } from "next/server";

import { transactions } from "@/modules/transactions/mocks/transaction";

import {
  Transaction,
  TransactionStatus,
} from "@/modules/transactions/types/transactions";

const DEFAULT_PAGE = 1;

const DEFAULT_PAGE_SIZE = 20;

const filterTransactionsBySearch = (
  transactions: Transaction[],
  search: string,
) => {
  if (!search) {
    return transactions;
  }

  return transactions.filter((transaction) => {
    return (
      transaction.customerName.toLowerCase().includes(search) ||
      transaction.email.toLowerCase().includes(search)
    );
  });
};

const filterTransactionsByStatus = (
  transactions: Transaction[],
  status?: TransactionStatus[],
) => {
  if (!status?.length) {
    return transactions;
  }

  return transactions.filter((transaction) => {
    return status.includes(transaction.status);
  });
};

const compareAmount = (
  a: Transaction,
  b: Transaction,
  direction: "asc" | "desc",
) => {
  return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
};

const compareCreatedAt = (
  a: Transaction,
  b: Transaction,
  direction: "asc" | "desc",
) => {
  return direction === "asc"
    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

const compareStringValues = (
  aValue: unknown,
  bValue: unknown,
  direction: "asc" | "desc",
) => {
  return direction === "asc"
    ? String(aValue).localeCompare(String(bValue))
    : String(bValue).localeCompare(String(aValue));
};

const sortTransactions = ({
  transactions,
  sortKey,
  direction,
}: {
  transactions: Transaction[];
  sortKey: keyof Transaction;
  direction: "asc" | "desc";
}) => {
  return [...transactions].sort((a, b) => {
    if (sortKey === "amount") {
      return compareAmount(a, b, direction);
    }

    if (sortKey === "createdAt") {
      return compareCreatedAt(a, b, direction);
    }

    return compareStringValues(a[sortKey], b[sortKey], direction);
  });
};

const paginateTransactions = ({
  transactions,
  page,
  pageSize,
}: {
  transactions: Transaction[];
  page: number;
  pageSize: number;
}) => {
  const total = transactions.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: transactions.slice(start, end),
    total,
    totalPages,
  };
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get("page")) || DEFAULT_PAGE;

  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  const search = searchParams.get("search")?.toLowerCase() || "";

  const sortKey =
    (searchParams.get("sortKey") as keyof Transaction) || "createdAt";

  const direction = searchParams.get("direction") === "asc" ? "asc" : "desc";

  const status = searchParams.get("status")?.split(",").filter(Boolean) as
    | TransactionStatus[]
    | undefined;

  const searchFilteredTransactions = filterTransactionsBySearch(
    transactions,
    search,
  );

  const statusFilteredTransactions = filterTransactionsByStatus(
    searchFilteredTransactions,
    status,
  );

  const sortedTransactions = sortTransactions({
    transactions: statusFilteredTransactions,
    sortKey,
    direction,
  });

  const paginatedTransactions = paginateTransactions({
    transactions: sortedTransactions,
    page,
    pageSize,
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    data: paginatedTransactions.data,
    total: paginatedTransactions.total,
    page,
    pageSize,
    totalPages: paginatedTransactions.totalPages,
  });
}
