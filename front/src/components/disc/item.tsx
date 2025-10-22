import { ChevronRight } from "lucide-react";
import { getUniqueDisc, DiscResultResponse } from "@/service/user/disc/get-unique-disc";
import { Section } from "@/components/disc/section";
import { useState } from "react";
import { DiscSnippet } from "@/service/user/disc/get-all-discs-list";

const discProfileTranslations = {
  DOMINANCE: "Dominante",
  INFLUENCING: "Influente",
  STEADINESS: "Estável",
  COMPLIANCE: "Conforme",
};

// --- COMPONENTE DO SNIPPET (Item da Lista) ---
export function DiscHistoryItem({ disc }: { disc: DiscSnippet }) {
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
          <p className="text-base text-gray-500">
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
              <Section title="Você no DISC">
                <p className="text-base text-gray-700 italic">
                  {details.yourDiscProfile || "Carregando..."}
                </p>
              </Section>
              <Section title="Máscara Postural">
                <p className="text-base text-gray-700 italic">
                  {details.publicProfile || "Carregando..."}
                </p>
              </Section>

              <Section title="Íntimo">
                <p className="text-base text-gray-700 italic">
                  {details.privateSelf || "Carregando..."}
                </p>
              </Section>

              <Section title="Postura Usual">
                <p className="text-base text-gray-700 italic">
                  {details.naturalBehavior || "Carregando..."}
                </p>
              </Section>

              <Section title="Aconselhamento Adicional">
                <p className="text-base text-gray-700 italic">
                  {details.developmentTips || "Carregando..."}
                </p>
              </Section>
            </>
          )}
        </div>
      )}
    </div>
  );
}