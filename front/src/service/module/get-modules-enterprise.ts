import { api } from "../api";

export const getModules = async(enterpriseId: string) => {
  try {
    const res = await api.get(`/module/enterprise/${enterpriseId}`)
    return res.data
  }catch(err) {
    console.log(err);
    throw new Error
  }
}