import { api } from "../api";

export const getUniqueJob = async (jobId: string) => {
  try {
    const res = await api.get(`/job-opening/${jobId}`);
    return res.data
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
