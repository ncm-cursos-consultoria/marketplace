import { api } from "../api";

export const getAllCourses = async() => {
  try {
    const res = await api.get(`/course`)
    return res.data
  }catch(err) {
    console.log(err);
    throw new Error 
  }
}