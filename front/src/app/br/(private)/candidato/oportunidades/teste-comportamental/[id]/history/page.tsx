"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllDiscsList, DiscSnippet } from "@/service/user/disc/get-all-discs-list";
import { DiscHistoryItem } from "@/components/disc/item";

interface DiscHistoryPageProps {
  params: {
    id: string;
  };
}

// A assinatura da função deve receber o objeto 'params'
export default function DiscHistoryPage({ params }: DiscHistoryPageProps) {
  const router = useRouter();
  const [history, setHistory] = useState<DiscSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = params.id;

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchHistory() {
      try {
        const data = await getAllDiscsList([userId]);
        setHistory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [id]); // O `[params.id]` diz: "rode este código de novo se o ID na URL mudar"

  if (isLoading) {
    return <main className="p-10">Carregando histórico...</main>;
  }

  if (history.length === 0) {
    return (
      <main className="p-10 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Histórico de Testes</h1>
        <p>Você ainda não realizou nenhum teste.</p>
        <button
          onClick={() => router.push(`/br/candidato/oportunidades/teste-comportamental/${userId}/new`)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Fazer meu primeiro teste
        </button>
      </main>
    );
  }

  // ====== RENDERIZAÇÃO PRINCIPAL (quando já temos os dados) ======
  return (
    <main className="p-6 lg:p-10 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          Histórico de Testes DISC
        </h1>
        <button
          onClick={() => router.push(`/br/candidato/oportunidades/teste-comportamental/${userId}/new`)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Fazer Novo Teste
        </button>
      </header>

      {/* Container para a lista de snippets */}
      <div className="space-y-3">
        {history.map((disc) => (
          <DiscHistoryItem key={disc.id} disc={disc} />
        ))}
      </div>
    </main>
  );
}