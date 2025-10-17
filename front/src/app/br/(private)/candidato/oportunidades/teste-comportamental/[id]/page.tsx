"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { getUniqueDisc } from "@/service/user/disc/get-unique-disc";
import { Section } from "@/components/disc/section";
import { Info } from "@/components/disc/info";

// Tipos para os dados da API (como DTOs do Java)
interface DiscResult {
  id: string;
  createdAt: string; // Vem como string ISO da API
  main: "DOMINANCE" | "INFLUENCING" | "STEADINESS" | "COMPLIANCE";
  // Adicione outras propriedades aqui quando seu backend as tiver
}

// Dicionário de tradução para os perfis
const discProfileTranslations = {
  DOMINANCE: "Dominante",
  INFLUENCING: "Influente",
  STEADINESS: "Estável",
  COMPLIANCE: "Conforme",
};

export default function DiscResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { userCandidate, isLoading: isUserLoading } = UseUserCandidate();
  const [result, setResult] = useState<DiscResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    const lastDiscId = userCandidate?.discId;
    const userId = params.id;

    if (!lastDiscId) {
      console.log("Nenhum teste encontrado, redirecionando para a página de novo teste...");
      router.replace(`/br/candidato/oportunidades/teste-comportamental/${userId}/new`);
    } else {
      async function fetchResult() {
        try {
          if (typeof lastDiscId === 'string') {
            const data = await getUniqueDisc(lastDiscId);
            setResult(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchResult();
    }
  }, [userCandidate, isUserLoading, params.id, router]); // Dependências do useEffect

  const handleHistoryClick = () => {
    router.push(`/br/candidato/oportunidades/teste-comportamental/${params.id}/history`);
  };

  const handleNewTestClick = () => {
    router.push(`/br/candidato/oportunidades/teste-comportamental/${params.id}/new`);
  };

  if (isLoading || isUserLoading) {
    return <main className="p-10">Carregando resultado...</main>;
  }

  if (!result) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-xl font-semibold">Erro ao Carregar</h1>
        <p>Não foi possível carregar o resultado do seu teste.</p>
      </main>
    );
  }

  // ----- RENDERIZAÇÃO DA PÁGINA COM DADOS DINÂMICOS -----
  return (
    <main className="p-6 lg:p-10 space-y-8">
      {/* Botões de Ação */}
      <div className="flex justify-end items-center space-x-4">
        <button onClick={handleHistoryClick} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Ver Histórico
        </button>
        <button onClick={handleNewTestClick} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Fazer Novo Teste</button>
      </div>

      {/* Cabeçalho */}
      <header className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          {/* DADO DINÂMICO */}
          {`DISC — Resultado do Teste Comportamental - (${discProfileTranslations[result.main] || result.main})`}
        </h1>
        <p className="text-gray-600">Relatório Postural Expandido</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {/* DADOS DINÂMICOS E PLACEHOLDERS */}
          <Info label="Nome" value={userCandidate?.firstName + ' ' + userCandidate?.lastName || "Não encontrado"} />
          <Info label="Data" value={new Date(result.createdAt).toLocaleDateString('pt-BR')} />
          <Info label="Origem" value={"NCM Marketplace"} /> {/* Placeholder */}
        </div>
      </header>

      {/* Seções com Placeholders */}
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

      <footer className="pt-4 text-xs text-gray-500">
        Fonte: NCM Marketplace. Conteúdo gerado dinamicamente.
      </footer>

    </main>
  );
}