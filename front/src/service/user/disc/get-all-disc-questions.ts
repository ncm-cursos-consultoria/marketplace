import { api } from "../../api";

export const getAllDiscQuestions = async () => {
  try {
    const res = await api.get(`/disc/question`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error("erro get all discs list");
  }
};
