import { Tag } from "@/types/domain";
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
  tags: Tag[]; // Não se esqueça de incluir as tags se elas vierem da API
};

export type JobOpeningUserCandidateStatus = 
    "UNDER_REVIEW" |
    "SELECTED" |
    "NOT_SELECTED" |
    "APPROVED" |
    "REJECTED";

export type JobStatus = "ACTIVE" | "PAUSED" | "CLOSED";

export interface JobFilters {
  enterpriseIds?: string[];
  jobOpeningStatuses?: JobStatus[];
  userIds?: string[];
  jobOpeningUserCandidateStatuses?: JobOpeningUserCandidateStatus[];
  thirdParty?: string[];
  searchQuery?: string;
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
