"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, BarChart2, FileText, Lock } from "lucide-react";

// Imports de UI
import { Button } from "@/components/ui/button";

// Imports Locais
import { UseUserEnteprise } from "@/context/user-enterprise.context";
import { getUniqueUser } from "@/service/user/get-unique-user";
import { CurriculumVitaeTab, DiscProfileTab, GeneralInfoTab } from "@/components/enterprise/candidate-card";

type ActiveTab = "general" | "disc" | "cv";

export default function CandidateProfilePage() {
  const params = useParams();
  const candidateId = params.id as string;
  const router = useRouter();
  const { userEnterprise } = UseUserEnteprise();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");

  const canViewTests = userEnterprise?.canViewTests ?? false;

  // Query para buscar UM candidato pelo ID
  const { data: candidate, isLoading, isError } = useQuery({
    queryKey: ["candidate", candidateId],
    queryFn: () => getUniqueUser(candidateId),
    enabled: !!candidateId,
  });

  if (isLoading) return <div className="p-10">Carregando perfil...</div>;
  if (isError || !candidate) return <div className="p-10">Erro ao carregar perfil.</div>;

  return (
    <main className="p-6 lg:p-10 space-y-6">
      {/* Header com Botão Voltar */}
      <header className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {candidate.firstName} {candidate.lastName}
          </h1>
          <p className="text-gray-500 text-sm">
            Visualizando perfil do Banco de Talentos
          </p>
        </div>
      </header>

      {/* Navegação de Abas (Copiada/Adaptada) */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="h-4 w-4" /> Geral
        </button>
        
        <button
          onClick={() => setActiveTab('disc')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'disc' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {canViewTests ? <BarChart2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          Perfil DISC
        </button>

        <button
          onClick={() => setActiveTab('cv')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'cv' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="h-4 w-4" /> Currículo
        </button>
      </div>

      {/* Conteúdo das Abas (Reutilizado!) */}
      <div className="mt-6">
        {activeTab === "general" && <GeneralInfoTab candidate={candidate} />}
        {activeTab === "disc" && <DiscProfileTab candidate={candidate} canViewTests={canViewTests} />}
        {activeTab === "cv" && <CurriculumVitaeTab candidate={candidate} />}
      </div>
    </main>
  );
}