import { api } from "../api";

export const getAllModules = async() => {
  try{
    const res =  await api.get("/module")
    return res.data
  }catch(err) {
    console.log(err);
    throw new Error()
  }
}