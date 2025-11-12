"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { getUniqueDisc } from "@/service/user/disc/get-unique-disc";
import { Section } from "@/components/disc/section";
import { Info } from "@/components/disc/info";
import { DiscResultResponse } from "@/service/user/disc/get-unique-disc";
import { useQuery } from "@tanstack/react-query"; // Importe o useQuery

const discProfileTranslations = {
  DOMINANCE: "Dominante",
  INFLUENCING: "Influente",
  STEADINESS: "Estável",
  COMPLIANCE: "Conforme",
};

interface DiscPageProps {
  params: { id: string };
}

export default function DiscResultPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { userCandidate, isLoading: isUserLoading } = UseUserCandidate();
  const lastDiscId = userCandidate?.discId;

  const {
    data: result,
    isLoading: isDiscLoading,
    isError
  } = useQuery<DiscResultResponse>({
    queryKey: ["disc-result", lastDiscId],

    queryFn: () => getUniqueDisc(lastDiscId!),
    enabled: !isUserLoading && !!lastDiscId,
  });

  const handleHistoryClick = () => {
    router.push(`/br/candidato/oportunidades/teste-comportamental/${userId}/history`);
  };

  const handleNewTestClick = () => {
    router.push(`/br/candidato/oportunidades/teste-comportamental/${userId}/new`);
  };

  useEffect(() => {
    // Se o usuário carregou E não tem um discId, vá para o /new
    if (!isUserLoading && !lastDiscId) {
      router.replace(`/br/candidato/oportunidades/teste-comportamental/${userId}/new`);
    }
  }, [isUserLoading, lastDiscId, router, userId]);

  // 5. LOADING E ERRO
  if (isUserLoading || isDiscLoading) {
    return <main className="p-10">Carregando resultado...</main>;
  }

  if (isError || !result) {
    return <main className="p-10">Erro ao carregar o teste.</main>;
  }

  // ----- RENDERIZAÇÃO DA PÁGINA COM DADOS DINÂMICOS -----
  return (
    <main className="p-6 lg:p-10 space-y-8">
      {/* Botões de Ação */}
      <div className="flex justify-end items-center space-x-4">
        <button onClick={handleHistoryClick} className="rounded-md bg-white px-4 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Ver Histórico
        </button>
        <button onClick={handleNewTestClick} className="rounded-md bg-blue-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-blue-500">Fazer Novo Teste</button>
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
      <Section title="Você no DISC">
        <p className="text-base text-gray-700 italic">
          {result.yourDiscProfile || "Carregando..."}
        </p>
      </Section>

      <Section title="Máscara Postural">
        <p className="text-base text-gray-700 italic">
          {result.publicProfile || "Carregando..."}
        </p>
      </Section>

      <Section title="Íntimo">
        <p className="text-base text-gray-700 italic">
          {result.privateSelf || "Carregando..."}
        </p>
      </Section>

      <Section title="Postura Usual">
        <p className="text-base text-gray-700 italic">
          {result.naturalBehavior || "Carregando..."}
        </p>
      </Section>

      <Section title="Aconselhamento Adicional">
        <p className="text-base text-gray-700 italic">
          {result.developmentTips || "Carregando..."}
        </p>
      </Section>

      <footer className="pt-4 text-xs text-gray-500">
        Fonte: NCM Marketplace. Conteúdo gerado dinamicamente.
      </footer>

    </main>
  );
}