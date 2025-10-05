import { api } from "../api";

interface postJobProps {
  title: string;
  salary: number;
  description: string;
}

export const postJob = async (data: postJobProps) => {
  try {
    const res = await api.post("", data);
    return res.data;
  } catch (err: any) {
    console.log(err);
    throw new Error("error post job");
  }
};
