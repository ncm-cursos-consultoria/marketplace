// .../teste-comportamental/[id]/history/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

// Importe a função do serviço e o tipo que criamos
import { getAllDiscsList, DiscSnippet } from "@/service/user/disc/get-all-discs-list"; // Ajuste o caminho

// Dicionário para traduzir o perfil principal
const discProfileTranslations = {
  DOMINANCE: "Dominante",
  INFLUENCING: "Influente",
  STEADINESS: "Estável",
  COMPLIANCE: "Conforme",
};

// A página recebe os parâmetros da URL, incluindo o 'id' do usuário
export default function DiscHistoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // "Memória" do componente para guardar a lista de testes e o estado de carregamento
  const [history, setHistory] = useState<DiscSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // "Gatilho" para buscar os dados quando a página carrega
  useEffect(() => {
    const userId = params.id; // Pega o ID do usuário da URL

    if (!userId) {
      // Se não houver ID na URL, não faz nada
      setIsLoading(false);
      return;
    }

    async function fetchHistory() {
      try {
        // Chama a função do serviço, passando o ID do usuário logado como uma lista de um item
        const data = await getAllDiscsList([userId]);
        setHistory(data); // Guarda os resultados na "memória"
      } catch (error) {
        console.error(error);
        // Aqui você pode guardar um estado de erro para mostrar na tela
      } finally {
        setIsLoading(false); // Para de mostrar o "Carregando..."
      }
    }

    fetchHistory();
  }, [params.id]); // O `[params.id]` diz: "rode este código de novo se o ID na URL mudar"

  // Renderização condicional: mostra um estado de carregamento
  if (isLoading) {
    return <main className="p-10">Carregando histórico...</main>;
  }

  // Renderização condicional: mostra se não houver histórico
  if (history.length === 0) {
    return (
      <main className="p-10 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Histórico de Testes</h1>
        <p>Você ainda não realizou nenhum teste.</p>
        <button
          onClick={() => router.push(`/br/candidato/oportunidades/teste-comportamental/${params.id}/new`)}
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
          onClick={() => router.push(`/br/candidato/oportunidades/teste-comportamental/${params.id}/new`)}
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

// --- COMPONENTE DO SNIPPET (Item da Lista) ---
function DiscHistoryItem({ disc }: { disc: DiscSnippet }) {
  const router = useRouter();

  // A função de clique que você vai implementar depois
  const handleItemClick = () => {
    // Exemplo de como seria a navegação para o resultado detalhado
    // router.push(`/br/candidate/disc/result/${disc.id}`);
    console.log("Clicou para ver detalhes do teste:", disc.id);
  };
  
  // Formata a data para o padrão brasileiro
  const formattedDate = new Date(disc.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    // 'group' é um truque do Tailwind para mudar o estilo de um filho quando o mouse está sobre o pai
    <div onClick={handleItemClick} className="group flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-colors">
      <div>
        <p className="font-semibold text-gray-800">
          Perfil Principal: {discProfileTranslations[disc.main] || disc.main}
        </p>
        <p className="text-sm text-gray-500">
          Realizado em: {formattedDate}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
    </div>
  );
}