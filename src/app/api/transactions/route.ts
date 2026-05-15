import { NextRequest, NextResponse } from "next/server";

import { transactions } from "@/modules/transactions/mocks/transaction";
import {
  Transaction,
  TransactionStatus,
} from "@/modules/transactions/types/transactions";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

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

  let filteredTransactions = [...transactions];

  // Search
  if (search) {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      return (
        transaction.customerName.toLowerCase().includes(search) ||
        transaction.email.toLowerCase().includes(search)
      );
    });
  }

  // Status filter
  if (status?.length) {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      return status.some(
        (currentStatus) => currentStatus === transaction.status,
      );
    });
  }

  // Sorting
  filteredTransactions.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (sortKey === "amount") {
      return direction === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }

    if (sortKey === "createdAt") {
      return direction === "asc"
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const total = filteredTransactions.length;

  const totalPages = Math.ceil(total / pageSize);

  const start = (page - 1) * pageSize;

  const end = start + pageSize;

  const paginatedTransactions = filteredTransactions.slice(start, end);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    data: paginatedTransactions,
    total,
    page,
    pageSize,
    totalPages,
  });
}
