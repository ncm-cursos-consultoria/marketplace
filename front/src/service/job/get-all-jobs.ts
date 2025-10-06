import { api } from "../api";

export const getAllJobs = async() => {
  try{
    const res = await api.get("/job-opening")
    return res.data
  }catch(err) {
    console.log(err);
    throw new Error
  }
}