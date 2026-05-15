import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getTransactions } from "../services/get-transactions";
import { TransactionsQueryParams } from "../types/transactions";
import { useTransactionEntityStore } from "../store/use-transaction-entity-store";

export const useTransactions = (params: TransactionsQueryParams) => {
  const upsertTransactions = useTransactionEntityStore(
    (state) => state.upsertTransactions,
  );

  const query = useQuery({
    queryKey: ["transactions"],

    queryFn: ({ signal }) =>
      getTransactions(
        {
          ...params,
          page: 1,
          pageSize: 9999,
        },
        signal,
      ),

    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!query.data?.data) {
      return;
    }

    upsertTransactions(query.data.data);
  }, [query.data?.data, upsertTransactions]);

  return query;
};
