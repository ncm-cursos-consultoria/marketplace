import { MyApplicationStatus, Tag } from "@/types/domain";
import { api } from "../api";

// 1. DEFINA O TIPO COMPLETO AQUI
export type ApiCurrency = {
  code: string;
  symbol: string;
  displayName: string;
};

export type ApiJob = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  salary: number;
  currency: ApiCurrency;
  description: string;
  status: "ACTIVE" | "PAUSED" | "CLOSED" | string;
  country: string;
  state: string;
  city: string;
  workModel: "ON_SITE" | "HYBRID" | "REMOTE" | string;
  views: number;
  enterpriseId: string;
  affinity: number;
  tags: Tag[]; // Não se esqueça de incluir as tags se elas vierem da API
  myApplicationStatus?: JobOpeningUserCandidateStatus;
};

export type JobOpeningUserCandidateStatus =
  "UNDER_REVIEW" |
  "SELECTED" |
  "NOT_SELECTED" |
  "APPROVED" |
  "REJECTED";

export const statusApplicationMap: Record<MyApplicationStatus, { text: string; className: string }> = {
  UNDER_REVIEW: { text: "Em Análise", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  SELECTED: { text: "Selecionado", className: "bg-blue-100 text-blue-800 border-blue-200" },
  APPROVED: { text: "Aprovado", className: "bg-green-100 text-green-800 border-green-200" },
  REJECTED: { text: "Rejeitado", className: "bg-red-100 text-red-800 border-red-200" },
  NOT_SELECTED: { text: "Não Selecionado", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

export const getApplicationStatusStyle = (status: MyApplicationStatus) => {
  return statusApplicationMap[status] || { text: status, className: "bg-gray-100 text-gray-800" };
};

export type JobStatus = "ACTIVE" | "PAUSED" | "CLOSED";

export interface JobFilters {
  enterpriseIds?: string[];
  jobOpeningStatuses?: JobStatus[];
  userIds?: string[];
  jobOpeningUserCandidateStatuses?: JobOpeningUserCandidateStatus[];
  thirdParty?: string[];
  searchQuery?: string;
  affinity?: boolean;
}

// 2. ATUALIZE O TIPO DE RETORNO DA FUNÇÃO
export const getAllJobs = async (filters?: JobFilters): Promise<ApiJob[]> => {
  try {
    const { data } = await api.get("/job-opening", {
      params: filters,
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    throw new Error("Não foi possível carregar as vagas.");
  }
};
