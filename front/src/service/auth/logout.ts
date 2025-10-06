import { api } from "../api";

export const logout = async () => {
  try {
    const response = await api.post(`/auth/logout`);
    return response.data
  } catch (err) {
    console.log(err);
    throw new Error("error logout");
  }
};
