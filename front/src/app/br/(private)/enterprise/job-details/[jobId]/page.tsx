// src/app/enterprise/job-details/[jobId]/page.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getJobDetails, type JobFull } from "@/service/job/get-job-details";
import { updateJobStatus, JobOpeningStatus } from "@/service/job/update-job-status";
import { toast } from "sonner";
import {
  Briefcase, MapPin, Users, FileText,
  Loader2
} from "lucide-react";
import { JobDetailsTab } from "@/components/enterprise/job-details-tab";
import { JobCandidatesTab } from "@/components/enterprise/job-candidates-tab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatValue, workModelTranslations } from "@/utils/translations";

type ActiveTab = "details" | "candidates";

const STATUS_OPTIONS: { value: JobOpeningStatus; label: string }[] = [
  { value: "ACTIVE", label: "🟢 Ativa" },
  { value: "PAUSED", label: "🟡 Pausada" },
  { value: "CLOSED", label: "🔴 Fechada" },
];

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [activeTab, setActiveTab] = useState<ActiveTab>("details");
  const queryClient = useQueryClient();

  const { data: job, isLoading, isError } = useQuery<JobFull>({
    queryKey: ["jobDetails", jobId],
    queryFn: () => getJobDetails(jobId),
    enabled: !!jobId, // Só roda se o jobId existir
  });

  const { mutate: changeStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateJobStatus,
    onSuccess: (updatedJob) => {
      // 8. ATUALIZAÇÃO OTIMISTA: Atualiza o cache do React Query IMEDIATAMENTE
      // Isso faz a UI mudar sem precisar de um 'refetch'
      queryClient.setQueryData(["jobDetails", jobId], updatedJob);
      toast.success("Status da vaga atualizado!");
    },
    onError: (err) => {
      toast.error("Falha ao atualizar o status. Tente novamente.");
    },
  });

  // 9. Handler para o Select
  const handleStatusChange = (newStatus: JobOpeningStatus) => {
    if (newStatus !== job?.status) {
      changeStatus({ jobId: jobId, status: newStatus });
    }
  };

  // --- Renderização de Carregamento ---
  if (isLoading) {
    return <main className="p-10">Carregando vaga...</main>;
  }

  // --- Renderização de Erro ---
  if (isError || !job) {
    return <main className="p-10">Erro ao carregar detalhes da vaga.</main>;
  }

  // --- Renderização Principal ---
  return (
    <main className="p-6 lg:p-10 space-y-6">
      {/* Header da Vaga (Informações principais) */}
      <header className="pb-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
            {job.title}
          </h1>

          {/* --- SELETOR DE STATUS ADICIONADO --- */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isUpdatingStatus && (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            )}
            <Select
              value={job.status}
              onValueChange={(value: JobOpeningStatus) => handleStatusChange(value)}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Mudar status..." />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-gray-600 mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {job.city} - {job.state}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            {/* --- 2. USE A FUNÇÃO AQUI --- */}
            {formatValue(job.workModel, workModelTranslations)}
            {/* ANTES: {job.workModel} */}
          </span>
        </p>
      </header>

      {/* 3. AS ABAS */}
      <div className="flex border-b border-gray-200">
        <TabButton
          label="Detalhes da Vaga"
          icon={<FileText className="h-4 w-4" />}
          isActive={activeTab === "details"}
          onClick={() => setActiveTab("details")}
        />
        <TabButton
          label="Candidatos"
          icon={<Users className="h-4 w-4" />}
          isActive={activeTab === "candidates"}
          onClick={() => setActiveTab("candidates")}
        />
      </div>

      {/* 4. O CONTEÚDO DAS ABAS (Renderização Condicional) */}
      <div className="mt-4">
        {activeTab === "details" && (
          <JobDetailsTab job={job} />
        )}
        {activeTab === "candidates" && (
          <JobCandidatesTab jobId={jobId} />
        )}
      </div>
    </main>
  );
}


// --- Componente de Botão de Aba (colocado aqui para simplicidade) ---
interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${isActive
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-gray-500 hover:text-gray-700"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}