import { api } from "../api";

export const getUniqueUser = async (userId?: string) => {
  try {
    const res = await api.get(`/user/candidate/${userId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error("erro get unique user");
  }
};
