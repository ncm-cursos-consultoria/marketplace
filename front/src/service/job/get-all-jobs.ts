import { api } from "../api";

type JobStatus = "ACTIVE" | "PAUSED" | "CLOSED";

interface JobFilters {
  enterpriseIds: string[];
  jobOpeningStatuses: JobStatus[];
}

export interface JobSnippet {
  id: string;
  title: string;
  city: string;
  state: string;
  workModel: string;
  status: JobStatus;
  views: number;
  tags: Tag[];
}

interface Tag {
  id: string;
  name: string;
  type: string;
}

export const getAllJobs = async (filters: JobFilters): Promise<JobSnippet[]> => {
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