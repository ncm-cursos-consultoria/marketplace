import { api } from "../../api";

export const getUniqueDisc = async (discId: string) => {
  try {
    const res = await api.get(`/disc/${discId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error("erro get unique disc");
  }
};
