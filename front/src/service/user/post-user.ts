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
  try {
    const res = await api.post(`/user/candidate`, data);
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
