import { api } from "../../api";

export const getAllDiscsList = async (userIds: string[]) => {
  try {
    const res = await api.get(`/disc/list`,{
        params: { userIds: userIds },
        
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error("erro get all discs list");
  }
};
