// .../enterprise/jobs/[id]/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Briefcase, MapPin } from "lucide-react";
import { getAllJobs, JobSnippet } from "@/service/job/get-all-jobs";
import { ModalCreateJob } from "@/components/enterprise/modal-create-jobs";

// Dicionário de tradução para os status
const statusTranslations = {
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  CLOSED: "Fechada",
};

// Dicionário de estilo para os badges de status
const statusStyles = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
  CLOSED: "bg-rose-100 text-rose-700",
};

type JobStatus = "ACTIVE" | "PAUSED" | "CLOSED";

// Props da página, para pegar o 'id' da empresa da URL
interface JobsPageProps {
  params: { id: string }; // 'id' aqui é o enterpriseId
}

export default function EnterpriseJobsPage({ params }: JobsPageProps) {
  const router = useRouter();
  const enterpriseId = params.id;
  const queryClient = useQueryClient();

  // 1. "MEMÓRIA" (Estado): Para guardar qual filtro de status está ativo
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>("ACTIVE");

  // 2. "GATILHO" (Busca de Dados):
  //    O react-query busca os dados
  const { data: jobs, isLoading, isError } = useQuery({
    // A queryKey é a "identidade" desta busca.
    // Ela inclui 'enterpriseId' e 'selectedStatus'
    queryKey: ["enterpriseJobs", enterpriseId, selectedStatus],
    
    // A função que realmente busca os dados
    queryFn: () => getAllJobs({
      enterpriseIds: [enterpriseId],
      jobOpeningStatuses: [selectedStatus],
    }),
    
    // Só executa se o enterpriseId existir
    enabled: !!enterpriseId,
  });

  // --- Renderização de Carregamento ---
  if (isLoading) {
    return <main className="p-10">Carregando vagas...</main>;
  }

  // --- Renderização de Erro ---
  if (isError) {
    return <main className="p-10">Erro ao carregar vagas.</main>;
  }

  // --- Renderização Principal ---
  return (
    <main className="p-6 lg:p-10 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
            Minhas Vagas
          </h1>
          <p className="text-gray-600 mt-1">Gerencie, edite e acompanhe suas vagas publicadas.</p>
        </div>
        {/* Só mostra o botão "Nova Vaga" no header se JÁ TIVER vagas */}
        {/* O <ModalCreateJob /> vai renderizar o botão "Nova Vaga" aqui */}
        {/* Só mostramos o botão se não houver vagas (a versão "vazia" tem o seu próprio) */}
        {jobs && jobs.length > 0 && (
          <ModalCreateJob />
        )}
      </header>

      {/* 3. OS FILTROS DE STATUS */}
      <div className="flex border-b border-gray-200">
        {(["ACTIVE", "PAUSED", "CLOSED"] as JobStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 text-sm font-medium ${
              selectedStatus === status
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {statusTranslations[status]}
          </button>
        ))}
      </div>

      {/* 4. A LISTA DE VAGAS ou O ESTADO DE VAZIO */}
      <div>
        {jobs && jobs.length > 0 ? (
          // Se TEM vagas, renderiza a lista
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState>
            <ModalCreateJob />
          </EmptyState>
        )}
      </div>
    </main>
  );
}

// --- Componente do Card da Vaga (Snippet) ---
function JobCard({ job }: { job: JobSnippet }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-gray-800">{job.title}</h3>
        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
          <MapPin className="h-4 w-4" />
          {job.city} - {job.state}
          <span className="text-gray-300">|</span>
          <Briefcase className="h-4 w-4" />
          {job.workModel}
        </p>
      </div>
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[job.status]}`}>
        {statusTranslations[job.status]}
      </span>
    </div>
  );
}

// --- Componente de Estado de Vazio ---
function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-20 px-6 border-2 border-dashed border-gray-300 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-900">Nenhuma vaga encontrada</h3>
      <p className="mt-1 text-gray-500">
        Você ainda não publicou nenhuma vaga com o status selecionado.
      </p>
      <div className="mt-6">
        {/* Ele renderiza o <ModalCreateJob> que foi passado */}
        {children}
      </div>
    </div>
  );
}