import { api } from "../../api";

// 1. Defina a interface para o snippet de resultado.
//    Ela deve bater com o seu 'DiscListResponse' do backend.
export interface DiscSnippet {
  id: string;
  createdAt: string; // A data virá como texto no formato ISO
  main: "DOMINANCE" | "INFLUENCING" | "STEADINESS" | "COMPLIANCE";
}

// 2. Adicione o tipo de retorno na sua função
export const getAllDiscsList = async (userIds: string[]): Promise<DiscSnippet[]> => {
  try {
    const res = await api.get(`/disc/list`, {
      params: { userIds },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar lista de testes DISC:", err);
    throw new Error("Erro ao buscar a lista de testes DISC");
  }
};