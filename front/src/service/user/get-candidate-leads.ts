// service/user/get-candidate-leads.ts
import { api } from "../api";

export type CandidateLeadProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  area?: string;
};

export type CandidateLeadPage = {
  content: CandidateLeadProfile[];
  totalPages: number;
  totalElements: number;
  number: number;
};

export const getCandidateLeads = async (params: {
  search?: string;
  page?: number;
  size?: number;
}): Promise<CandidateLeadPage> => {
  const { data } = await api.get("/candidate-lead", { params });
  return data;
};

