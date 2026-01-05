import { api } from "../../api";

export const getMentorById = async (id: string) => {
  const res = await api.get(`/user/mentor/${id}`);
  return res.data;
};