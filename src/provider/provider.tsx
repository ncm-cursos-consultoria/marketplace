"use client";
import { SimulateCandidateProvider } from "@/context/simulate-candidate-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        refetchOnReconnect: true,
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SimulateCandidateProvider>
        <Toaster richColors closeButton expand={false} className="w-[20vw]" />
        {children}
      </SimulateCandidateProvider>
    </QueryClientProvider>
  );
}
