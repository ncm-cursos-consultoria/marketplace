import { api } from "../api";
import { Tag } from "@/types/domain"; // ou onde sua interface Tag estiver

// Tipo simplificado do Candidato para a listagem
export type CandidateBaseProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  subTitle?: string; // ex: "Desenvolvedor Java Sênior"
  city?: string;
  state?: string;
  tags: Tag[];
  discTag?: string;
  // Adicione outros campos que seu backend retorna
};

export type CandidateBasePage = {
  content: CandidateBaseProfile[];
  totalPages: number;
  totalElements: number;
  number: number;
};

interface GetCandidatesParams {
  page?: number;
  size?: number;
  searchQuery?: string; // Nome ou Email
  tagIds?: string[];    // IDs das tags para filtrar
}

export const getCandidateBase = async (params: GetCandidatesParams): Promise<CandidateBasePage> => {
  try {
    
    const { data } = await api.get("/user/candidate/page", {
      params: {
        ...params,
      }
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar banco de talentos:", error);
    throw new Error("Não foi possível carregar os candidatos.");
  }
};