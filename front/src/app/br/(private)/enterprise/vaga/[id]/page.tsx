"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Briefcase, MapPin, Tag as TagIcon } from "lucide-react";
import { getAllJobs, JobSnippet } from "@/service/job/get-all-jobs";
import { ModalCreateJob } from "@/components/enterprise/modal-create-jobs";
import Link from "next/link";

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

export default function EnterpriseJobsPage() {
  const router = useRouter();
  const params = useParams();
  const enterpriseId = params.id as string;
  const queryClient = useQueryClient();

  // 1. "MEMÓRIA" (Estado): Para guardar qual filtro de status está ativo
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>("ACTIVE");

  // 2. "GATILHO" (Busca de Dados):
  //    O react-query busca os dados
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

  const handleJobCreateSuccess = () => {
    setSelectedStatus("ACTIVE");
  };

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
        {jobs && jobs.length > 0 && (
          <ModalCreateJob onSuccess={handleJobCreateSuccess} />
        )}
      </header>

      {/* 3. OS FILTROS DE STATUS */}
      <div className="flex border-b border-gray-200">
        {(["ACTIVE", "PAUSED", "CLOSED"] as JobStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 text-sm font-medium ${selectedStatus === status
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
            <ModalCreateJob onSuccess={handleJobCreateSuccess} />
          </EmptyState>
        )}
      </div>
    </main>
  );
}

// --- Componente do Card da Vaga (Snippet) ---
function JobCard({ job }: { job: JobSnippet }) {
  const jobDetailUrl = `/br/enterprise/job-details/${job.id}`;
  return (
    <Link
      href={jobDetailUrl}
      className="bg-white border rounded-lg shadow-sm p-4 flex justify-between items-start transition-all hover:shadow-md hover:border-blue-300 cursor-pointer"
    >
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-gray-800">{job.title}</h3>
        <p className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {job.city} - {job.state}
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            {job.workModel}
          </span>
        </p>

        {/* SEÇÃO DE TAGS ADICIONADA */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 pt-1">
            {job.tags.slice(0, 3).map(tag => (
              <span key={tag.id} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                {tag.name || tag.type}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="text-xs font-medium text-gray-500">
                + {job.tags.length - 3} mais
              </span>
            )}
          </div>
        )}
      </div>
      <span className={`ml-4 flex-shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[job.status]}`}>
        {statusTranslations[job.status]}
      </span>
    </Link>
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
