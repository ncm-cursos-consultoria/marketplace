import { api } from "../api";

// Interface para a resposta do DTO de Endereço
// Adapte os campos se o seu DTO for diferente
export interface Address {
  id: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const getAddress = async (addressId: string): Promise<Address> => {
  const { data } = await api.get(`/address/${addressId}`);
  return data as Address;
};
