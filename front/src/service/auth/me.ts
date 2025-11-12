import { api } from "../api";

export const me = async() => {
  try {
    const res = await api.get(`/auth/me`)
    console.log("Me: ", res.data);
    
    return res.data
  }catch(err: any) {
    console.log(err);
    throw new Error("error me request")
  }
}