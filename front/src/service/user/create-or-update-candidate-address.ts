import { api } from "../api"; // Ajuste o path se necessário
import { ApiAddress } from "@/types/address";

// Este tipo é baseado no seu DTO CreateAddressRequest
export interface UpdateAddressRequest {
  country: string;
  state: string;
  city: string;
  district: string;
  zip: string;
  street: string;
  number: string;
  addressLine2?: string;
}

interface PatchUserAddressParams {
  userId: string;
  data: UpdateAddressRequest;
}

export const patchUserAddress = async ({ userId, data }: PatchUserAddressParams): Promise<ApiAddress> => {
  const payload = {
    ...data,
    addressLine2: data.addressLine2 || undefined,
  };

  const { data: responseData } = await api.patch(
    `/user/candidate/${userId}/address`, 
    payload
  );
  
  return responseData as ApiAddress;
};