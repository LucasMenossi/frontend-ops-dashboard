"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 30,
          retry: 2,
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
