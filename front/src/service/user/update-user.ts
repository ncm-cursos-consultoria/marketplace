import { api } from "../api";

export const updateUser = async (userId: string, data: {}) => {
  try {
    const res = await api.put(`/user/candidate/${userId}`, data);
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
