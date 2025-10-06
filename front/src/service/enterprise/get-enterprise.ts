import { api } from "../api";

export const getEnterprise = async (enterpriseId: string) => {
  try {
    const res = await api.get(`/enterprise/${enterpriseId}`);
    return res.data;
  } catch (err: any) {
    console.log(err);
    throw new Error("error get enterprise when id");
  }
};
