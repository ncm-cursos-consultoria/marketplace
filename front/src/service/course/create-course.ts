import { api } from "../api";

interface createCourseProps {
  title: string;
  description: string;
  moduleId: string,
  videoUrl: string,
}

export const createCourse = async (data: createCourseProps) => {
  try {
    const res = await api.post(`/course`, data);
    return res.data
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
