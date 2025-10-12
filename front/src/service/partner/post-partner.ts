import { api } from "../api";

export const postPartner = async (data: {}) => {
  try {
    const res = await api.post(`/partner/with-enterprise-and-user`, data);
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error("erro post parner");
  }
};
