import { api } from "../api";

interface postJobProps {
  title: string;
  salary: number;
  description: string;
  city: string;
  state: string;
  workModel: string;
  country: string;
}

export const postJob = async (data: {}) => {
  try {
    console.log("Data: ", data);
    
    const res = await api.post("/job-opening", data);
    return res.data;
  } catch (err: any) {
    console.log(err);
    throw new Error("error post job");
  }
};
