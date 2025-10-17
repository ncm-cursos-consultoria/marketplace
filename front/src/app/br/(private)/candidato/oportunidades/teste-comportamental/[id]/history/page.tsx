"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getAllDiscsList, DiscSnippet } from "@/service/user/disc/get-all-discs-list";
import { getUniqueDisc, DiscResultResponse } from "@/service/user/disc/get-unique-disc";

const discProfileTranslations = {
  DOMINANCE: "Dominante",
  INFLUENCING: "Influente",
  STEADINESS: "Estável",
  COMPLIANCE: "Conforme",
};

interface DiscHistoryPageProps {
  params: {
    id: string;
  };
}

export default function DiscHistoryPage({ params }: DiscHistoryPageProps) {
  const router = useRouter();
  const [history, setHistory] = useState<DiscSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = params.id;

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
  }, [params.id]); // O `[params.id]` diz: "rode este código de novo se o ID na URL mudar"

  if (isLoading) {
    return <main className="p-10">Carregando histórico...</main>;
  }

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
  // 1. DANDO "MEMÓRIA" AO COMPONENTE:
  //    'isExpanded' guarda se o item está aberto ou fechado. Começa como 'false'.
  const [isExpanded, setIsExpanded] = useState(false);

  // 'details' vai guardar os dados que vêm da API quando expandimos. Começa como 'null'.
  const [details, setDetails] = useState<DiscResultResponse | null>(null);

  // 'isLoadingDetails' controla a mensagem de "Carregando..."
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // 2. A NOVA FUNÇÃO DE CLIQUE:
  const handleItemClick = async () => {
    const shouldExpand = !isExpanded; // Inverte o estado atual
    setIsExpanded(shouldExpand);

    // Se estamos expandindo E ainda não buscamos os detalhes
    if (shouldExpand && !details) {
      setIsLoadingDetails(true); // Mostra "Carregando..."
      try {
        // Busca os dados da API
        const data = await getUniqueDisc(disc.id);
        setDetails(data); // Guarda os detalhes na "memória"
      } catch (error) {
        // Lidar com o erro, talvez mostrar uma mensagem
        console.error(error);
      } finally {
        setIsLoadingDetails(false); // Esconde "Carregando..."
      }
    }
  };

  // Formata a data para o padrão brasileiro
  const formattedDate = new Date(disc.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    // O container principal agora é uma 'div' normal, não um link.
    // Usamos 'flex-col' para empilhar o header e o conteúdo detalhado.
    <div className="flex flex-col border rounded-lg shadow-sm bg-white">
      {/* O Header Clicável (o snippet) */}
      <div
        onClick={handleItemClick}
        className="group flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
      >
        <div>
          <p className="font-semibold text-gray-800">
            Perfil Principal: {discProfileTranslations[disc.main] || disc.main}
          </p>
          <p className="text-sm text-gray-500">
            Realizado em: {formattedDate}
          </p>
        </div>
        {/* A seta agora gira 90 graus quando o item está expandido */}
        <ChevronRight
          className={`h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
      </div>

      {/* 3. A SEÇÃO DE DETALHES (RENDERIZAÇÃO CONDICIONAL) */}
      {/* Esta 'div' só será renderizada se 'isExpanded' for true */}
      {isExpanded && (
        <div className="border-t p-4 space-y-2">
          {isLoadingDetails && <p>Carregando detalhes...</p>}

          {/* Se já carregou os detalhes, mostra os placeholders */}
          {details && (
            <>
              <Section title="Você no DISC" badge="PROFILE">
                <p className="text-sm text-gray-700 italic">
                  [PLACEHOLDER: Aqui entrará a descrição do perfil do usuário no DISC, vinda do backend.]
                </p>
              </Section>
              <Section title="Máscara Postural" badge="BEHAVIORAL">
                <p className="text-sm text-gray-700 italic">
                  [PLACEHOLDER: Aqui entrará a descrição da máscara postural do usuário, vinda do backend.]
                </p>
              </Section>

              <Section title="Íntimo" badge="PERSONAL">
                <p className="text-sm text-gray-700 italic">
                  [PLACEHOLDER: Aqui entrará a descrição do perfil íntimo do usuário, vinda do backend.]
                </p>
              </Section>

              <Section title="Postura Usual" badge="HABITUAL">
                <p className="text-sm text-gray-700 italic">
                  [PLACEHOLDER: Aqui entrará a descrição da postura usual do usuário, vinda do backend.]
                </p>
              </Section>

              <Section title="Aconselhamento Adicional" badge="SUGGESTION">
                <p className="text-sm text-gray-700 italic">
                  [PLACEHOLDER: Aqui entrará a lista de aconselhamentos para o usuário, vinda do backend.]
                </p>
              </Section>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <article className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div />
          {badge ? (
            <span className="text-[10px] leading-5 rounded-full border px-2 py-0.5 text-blue-700 bg-blue-50">{badge}</span>
          ) : null}
        </div>
        <div className="mt-2 space-y-2">{children}</div>
      </article>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-gray-50 p-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  );
}