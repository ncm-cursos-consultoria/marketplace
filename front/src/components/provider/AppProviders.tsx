"use client"; // <--- Essencial

import { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NextNProgressBar from 'nextjs-progressbar';

// 1. IMPORTAÇÃO DO SEU CONTEXTO (ajuste o path se necessário)
import { UserCandidateProvider } from '@/context/user-candidate.context';

// (Importe outros providers que você usa, como Toaster)
import { Toaster } from 'sonner';
import { UserEnterpriseProvider } from "@/context/user-enterprise.context";
import { UserPartnerProvider } from "@/context/user-partner.context";
import { UserMentorProvider } from "@/context/user-mentor.context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Configuração do React Query
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
      },
    },
  }));

  return (
    // 2. TODOS OS PROVIDERS DE CLIENTE VÊM AQUI
    <QueryClientProvider client={queryClient}>
      <UserCandidateProvider> {/* <--- Seu provider que estava dando erro */}
        <UserEnterpriseProvider>
          <UserPartnerProvider>
            <UserMentorProvider>
              {children} {/* <--- Suas páginas (layout, page, etc) */}
              {/* 3. Coloque os componentes "globais" aqui */}
              <Toaster position="bottom-right" richColors />
              <NextNProgressBar
                color="#2563eb" // Cor azul do seu logo
                startPosition={0.3}
                stopDelayMs={200}
                height={3}
                showOnShallow={true}
              />
            </UserMentorProvider>
          </UserPartnerProvider>
        </UserEnterpriseProvider>
      </UserCandidateProvider>
    </QueryClientProvider>
  );
}