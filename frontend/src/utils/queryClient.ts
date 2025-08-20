import { QueryClient } from "@tanstack/react-query";

// Central QueryClient instance so utilities (e.g. file upload) can invalidate queries.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});