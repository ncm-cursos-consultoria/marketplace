import { api } from "../api";

interface postJobProps {
  title: string;
  salary?: number | null;
  salaryRangeStart?: number | null; // Java 'Double'
  salaryRangeEnd?: number | null;   // Java 'Double'
  description: string;
  city: string;
  state: string;
  workModel: string;
  country: string;
}

export const postJob = async (data: {}) => {
  try {
    
    const res = await api.post("/job-opening", data);
    return res.data;
  } catch (err: any) {
    console.log(err);
    throw new Error("error post job");
  }
};
