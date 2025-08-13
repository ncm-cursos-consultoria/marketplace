import { api } from "../api";

interface postUserProps {
  nome: string;
  email: string;
  senha: string;
  tipo: string;
}

export const postUser = async (data: postUserProps) => {
  try {
    const res = await api.post(`/autenticacao/backend_criar_conta`, data);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
};
