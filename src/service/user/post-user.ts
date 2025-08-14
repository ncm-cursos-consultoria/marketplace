import { toast } from "sonner";
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
            toast.success("Conta criada com sucesso")
    } else {
      console.error(err);
            toast.success("Conta criada com sucesso")
    }
  }
};
