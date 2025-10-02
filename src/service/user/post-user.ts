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
    const res = await api.post(`/autenticacao/backend_criar_conta.php`, data);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      throw new Error();
    } else {
      console.error(err);
    }
  }
};
