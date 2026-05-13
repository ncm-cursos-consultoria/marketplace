import { api } from "../api";

interface postJobProps {
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  workModel: string;
  workPeriod: string;
  contractType?: string | null;
  currencyCode?: string;
  enterpriseId: string;
  salary?: number | null;
  salaryRangeStart?: number | null;
  salaryRangeEnd?: number | null;
  workStartTime?: string;
  workEndTime?: string;
  tagIds?: string[];
}

export const postJob = async (data: postJobProps) => {
  try {
    const res = await api.post("/job-opening", data);
    return res.data;
  } catch (err: any) {
    console.log(err);
    throw new Error("error post job");
  }
};