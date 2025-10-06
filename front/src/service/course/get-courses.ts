import { api } from "../api";

export const getCourses = async (moduleId: string) => {
  try {
    const res = await api.get(`/course/module/${moduleId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
