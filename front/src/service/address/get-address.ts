import { api } from "../api";

export const getAddress = async (addressId: string) => {
  try {
    const res = await api.get(`/address/${addressId}`);
    return res.data;
  } catch (err: any) {
    console.log(err);
    throw new Error("error get address when id");
  }
};
