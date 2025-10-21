"use client";

import { useQueries } from "@tanstack/react-query";
import { getJobCandidates, type JobCandidate } from "@/service/user/get-job-candidates";
import { getJobDetails, type JobFull } from "@/service/job/get-job-details";
import { CandidateCard } from "./candidate-card";

interface JobCandidatesTabProps {
  jobId: string;
}

export function JobCandidatesTab({ jobId }: JobCandidatesTabProps) {
  // Usamos 'useQueries' para buscar os candidatos E os detalhes da vaga em paralelo
  const results = useQueries({
    queries: [
      {
        queryKey: ["jobCandidates", jobId],
        queryFn: () => getJobCandidates({ jobOpeningIds: [jobId] }),
        enabled: !!jobId,
      },
      {
        queryKey: ["jobDetails", jobId],
        queryFn: () => getJobDetails(jobId),
        enabled: !!jobId,
      },
    ],
  });

  const isLoading = results.some((query) => query.isLoading);
  const isError = results.some((query) => query.isError);
  
  const candidates = results[0]?.data as JobCandidate[] | undefined;
  const job = results[1]?.data as JobFull | undefined;

  if (isLoading) {
    return <div className="text-center py-10">Carregando candidatos...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-600">Erro ao carregar candidatos.</div>;
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-10 px-6 border-2 border-dashed border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900">Nenhum candidato</h3>
        <p className="mt-1 text-gray-500">Ainda não há candidatos inscritos para esta vaga.</p>
      </div>
    );
  }
  
  // Extrai as tags da vaga para passarmos para cada card
  const jobTags = job?.tags ?? [];

  return (
    <div className="space-y-4">
      {candidates.map(candidate => (
        <CandidateCard
          key={candidate.id} 
          candidate={candidate} 
          jobTags={jobTags} // Passamos as tags da vaga para o card
        />
      ))}
    </div>
  );
}
