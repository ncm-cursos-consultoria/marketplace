// src/app/enterprise/job-details/[jobId]/page.tsx

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation"; // <--- 1. IMPORTE O 'useParams'
import { getJobDetails, type JobFull } from "@/service/job/get-job-details";
import { Briefcase, MapPin, Users, FileText } from "lucide-react";
import { JobDetailsTab } from "@/components/enterprise/job-details-tab";
import { JobCandidatesTab } from "@/components/enterprise/job-candidates-tab";

type ActiveTab = "details" | "candidates";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  // 1. ESTADO: Para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState<ActiveTab>("details");

  // 2. BUSCA DE DADOS: Buscamos os detalhes da vaga (a API principal)
  const { data: job, isLoading, isError } = useQuery<JobFull>({
    // A queryKey é específica para ESTA vaga
    queryKey: ["jobDetails", jobId],
    queryFn: () => getJobDetails(jobId),
    enabled: !!jobId, // Só roda se o jobId existir
  });

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
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          {job.title}
        </h1>
        <p className="text-gray-600 mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {job.city} - {job.state}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            {job.workModel}
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
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
        isActive
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}