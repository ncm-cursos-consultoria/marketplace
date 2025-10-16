import { api } from "../../api";

export interface DiscSnippet {
  id: string;
  createdAt: string;
  main: "DOMINANCE" | "INFLUENCING" | "STEADINESS" | "COMPLIANCE";
}

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