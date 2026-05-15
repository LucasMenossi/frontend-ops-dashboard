"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
} from "nuqs";

import {
  TransactionStatus,
  TransactionsQueryParams,
  SortDirection,
} from "../types/transactions";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_SORT_KEY = "createdAt";
const DEFAULT_DIRECTION: SortDirection = "desc";

export const useTransactionsQueryState = () => {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(DEFAULT_PAGE),
  );

  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  );

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const [status, setStatus] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [sortKey, setSortKey] = useQueryState(
    "sortKey",
    parseAsString.withDefault(DEFAULT_SORT_KEY),
  );

  const [direction, setDirection] = useQueryState(
    "direction",
    parseAsString.withDefault(DEFAULT_DIRECTION),
  );

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(DEFAULT_PAGE);

      setSearch(searchInput || null);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput, setSearch, setPage]);

  const updateFilters = useCallback(
    (nextStatus: TransactionStatus[]) => {
      setPage(DEFAULT_PAGE);

      setStatus(nextStatus.length ? nextStatus : null);
    },
    [setStatus, setPage],
  );

  const updateSorting = useCallback(
    (
      nextSortKey: TransactionsQueryParams["sortKey"],
      nextDirection: SortDirection,
    ) => {
      setPage(DEFAULT_PAGE);
      setSortKey(nextSortKey);
      setDirection(nextDirection);
    },
    [setSortKey, setDirection, setPage],
  );

  const updatePagination = useCallback(
    (nextPage: number, nextPageSize?: number) => {
      setPage(nextPage);

      if (nextPageSize) {
        setPageSize(nextPageSize);
      }
    },
    [setPage, setPageSize],
  );

  const resetFilters = useCallback(() => {
    setPage(DEFAULT_PAGE);
    setSearch(null);
    setStatus(null);
    setSortKey(DEFAULT_SORT_KEY);
    setDirection(DEFAULT_DIRECTION);
    setSearchInput("");
  }, [setPage, setSearch, setStatus, setSortKey, setDirection]);

  const queryParams = useMemo<TransactionsQueryParams>(
    () => ({
      page,
      pageSize,
      search,
      status: status as TransactionStatus[],
      sortKey: sortKey as TransactionsQueryParams["sortKey"],
      direction: direction as SortDirection,
    }),
    [page, pageSize, search, status, sortKey, direction],
  );

  return {
    queryParams,
    searchInput,
    setSearchInput,
    updateFilters,
    updateSorting,
    updatePagination,
    resetFilters,
  };
};
