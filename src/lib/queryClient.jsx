import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 4,
      gcTime: 1000 * 60 * 8,
      retry: 4,
    },
  },
});

window.__QC__ = queryClient;
