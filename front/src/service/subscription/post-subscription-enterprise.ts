import { api } from "../api";

export interface postSubscriptionEnterpriseProps {
  id: string;
  paymentMethodId: string;
}

export const postSubscriptionEnterprise = async (data: postSubscriptionEnterpriseProps) => {
  const res = await api.post(`/subscription/enterprise`, data);
  return res.data;
};
