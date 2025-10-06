import { api } from "../api";

export const getJobByEnterprise = async (enterpriseId: string) => {
  try {
    const res = await api.get(`/job-opening/enterprise/${enterpriseId}`);
    return res.data
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
