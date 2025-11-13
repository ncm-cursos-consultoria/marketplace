"use client";

import React, { useMemo, useState } from "react"; // 1. Importar useMemo e useState
import { useQueries } from "@tanstack/react-query";
import { getJobCandidates, type JobCandidate } from "@/service/user/get-job-candidates";
import { getJobDetails, type JobFull } from "@/service/job/get-job-details";
import { CandidateCard } from "./candidate-card";
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { Users, UserCheck } from "lucide-react"; // 2. Importar ícones para as sub-abas

interface JobCandidatesTabProps {
  jobId: string;
}

// 3. Definir os tipos para o filtro
type CandidateFilter = "ALL" | "INTERESTED";

// (Copiado da sua 'page.tsx' para usar aqui)
function TabButton({ label, icon, isActive, onClick }: {
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${isActive
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-gray-500 hover:text-gray-700"
        }`}
    >
      {React.createElement(icon, { className: "h-4 w-4" })}
      {label}
    </button>
  );
}
// --- Fim do componente copiado ---


export function JobCandidatesTab({ jobId }: JobCandidatesTabProps) {
  const { userEnterprise } = UseUserEnteprise();

  // 4. Estado para controlar a SUB-ABA ativa
  const [activeFilter, setActiveFilter] = useState<CandidateFilter>("ALL");

  const results = useQueries({
    queries: [
      {
        queryKey: ["jobCandidates", jobId], // Busca TODOS os candidatos
        queryFn: () => getJobCandidates({ jobOpeningIds: [jobId] }),
        enabled: !!jobId,
      },
      {
        queryKey: ["jobDetails", jobId], // Busca detalhes da vaga (para as tags)
        queryFn: () => getJobDetails(jobId),
        enabled: !!jobId,
      },
    ],
  });

  const isLoading = results.some((query) => query.isLoading);
  const isError = results.some((query) => query.isError);

  const allCandidates = (results[0]?.data as JobCandidate[] | undefined) ?? [];
  const job = results[1]?.data as JobFull | undefined;

  const canViewTests = userEnterprise?.canViewTests ?? false;

  // 5. Lógica de Filtragem
  // O 'useMemo' filtra a lista 'allCandidates' com base no 'activeFilter'
  const { candidatesAll, candidatesInterested } = useMemo(() => {
    // Lista de "Todos" é simplesmente 'allCandidates'
    const candidatesAll = allCandidates;

    // Lista de "Selecionados" é calculada independentemente
    const interestedStatuses = new Set(["SELECTED", "APPROVED"]);
    const candidatesInterested = allCandidates.filter(c =>
      c.myApplicationStatus && interestedStatuses.has(c.myApplicationStatus)
    );

    return { candidatesAll, candidatesInterested };
  }, [allCandidates]); // Só depende da lista principal

  // 3. Agora, 'filteredCandidates' apenas seleciona a lista correta
  const filteredCandidates = activeFilter === "ALL"
    ? candidatesAll
    : candidatesInterested;


  if (isLoading) {
    return <div className="text-center py-10">Carregando candidatos...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-600">Erro ao carregar candidatos.</div>;
  }

  const jobTags = job?.tags ?? [];

  return (
    // 6. O JSX ATUALIZADO
    <div className="space-y-4">
      {/* --- Sub-abas --- */}
      <div className="flex border-b border-gray-200">
        <TabButton
          // Usa a contagem de 'candidatesAll'
          label={`Todos os Inscritos (${candidatesAll.length})`}
          icon={Users}
          isActive={activeFilter === "ALL"}
          onClick={() => setActiveFilter("ALL")}
        />
        <TabButton
          // Usa a contagem de 'candidatesInterested'
          label={`Selecionados/Aprovados (${candidatesInterested.length})`}
          icon={UserCheck}
          isActive={activeFilter === "INTERESTED"}
          onClick={() => setActiveFilter("INTERESTED")}
        />
      </div>

      {/* --- Feedback de "Nenhum candidato" para o filtro específico --- */}
      {filteredCandidates.length === 0 ? (
        <div className="text-center py-10 px-6 border-2 border-dashed border-gray-300 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900">Nenhum candidato</h3>
          <p className="mt-1 text-gray-500">
            {activeFilter === "ALL"
              ? "Ainda não há candidatos inscritos para esta vaga."
              : "Nenhum candidato foi movido para 'Selecionado' ou 'Aprovado' ainda."}
          </p>
        </div>
      ) : (
        // --- Lista Filtrada ---
        <div className="space-y-4">
          {filteredCandidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              jobTags={jobTags}
              canViewTests={canViewTests}
              jobId={jobId}
            />
          ))}
        </div>
      )}
    </div>
  );
}