import { api } from "../api";

interface postUserProps {
  firstName?: string;
  lastName?: string;
  cpf?: string;
  email?: string;
  password: string;
  birthday: string;
}

export const postUser = async (data: postUserProps) => {
  const res = await api.post(`/user/candidate`, data);
  return res.data;
};
