// src/app/enterprise/job-details/[jobId]/components/JobCandidatesTab.tsx

"use client"; // Este componente *precisa* ser client-side para usar o 'useQuery'

import { useQuery } from "@tanstack/react-query";
import { getJobCandidates, type CandidateSnippet } from "@/service/user/get-job-candidates";

interface JobCandidatesTabProps {
  jobId: string;
}

export function JobCandidatesTab({ jobId }: JobCandidatesTabProps) {

  // Esta aba busca seus próprios dados!
  const { data: candidates, isLoading, isError } = useQuery({
    queryKey: ["jobCandidates", jobId],
    queryFn: () => getJobCandidates({ jobOpeningIds: [jobId] }), // A API espera um array
    enabled: !!jobId,
  });

  if (isLoading) {
    return <div>Carregando candidatos...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar candidatos.</div>;
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold">Nenhum candidato</h3>
        <p className="text-gray-500">Ainda não há candidatos inscritos para esta vaga.</p>
      </div>
    );
  }

  // Se temos candidatos, mostramos a lista
  return (
    <div className="space-y-3">
      {candidates.map(candidate => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}


// --- Componente do Card de Candidato ---
function CandidateCard({ candidate }: { candidate: CandidateSnippet }) {
  // Você pode tornar este card um Link para /enterprise/candidate-profile/[candidateId]
  // no futuro!
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center gap-4">
      <img
        src={candidate.avatarUrl || `https://ui-avatars.com/api/?name=${candidate.name}`}
        alt={candidate.name}
        className="h-12 w-12 rounded-full bg-gray-200"
      />
      <div>
        <h4 className="font-semibold text-gray-800">{candidate.name}</h4>
        <p className="text-sm text-gray-500">{candidate.email}</p>
      </div>
    </div>
  );
}