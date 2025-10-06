import { api } from "../api";

export const getModule = async(moduleId: string) => {
  try{
    const res = await api.get(`/module/${moduleId}`)
    return res.data
  }catch(err) {
    console.log(err);
    throw new Error
  }
}