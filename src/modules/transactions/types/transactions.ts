export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export interface Transaction {
  id: string;
  customerName: string;
  email: string;
  amount: number;
  currency: string;
  status: TransactionStatus;

  version: number;

  createdAt: string;
  updatedAt: string;
}

export type SortDirection = "asc" | "desc";

export interface TransactionsQueryParams {
  page: number;
  pageSize: number;
  search: string;
  status: TransactionStatus[];
  sortKey: keyof Pick<
    Transaction,
    "customerName" | "amount" | "status" | "createdAt" | "updatedAt"
  >;
  direction: SortDirection;
}
