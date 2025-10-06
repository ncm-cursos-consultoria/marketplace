"use client";
import { CandidateProvider } from "@/context/candidate.context";
import { UserCandidateProvider } from "@/context/user-candidate.context";
import { UserEnterpriseProvider } from "@/context/user-enterprise.context";
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
      <CandidateProvider>
        <UserCandidateProvider>
          <UserEnterpriseProvider>
            <Toaster
              richColors
              closeButton
              expand={false}
              className="w-[20vw]"
            />
            {children}
          </UserEnterpriseProvider>
        </UserCandidateProvider>
      </CandidateProvider>
    </QueryClientProvider>
  );
}
