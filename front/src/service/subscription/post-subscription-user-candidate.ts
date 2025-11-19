import { api } from "../api";

export interface postSubscriptionUserCandidateProps {
  id: string;
  paymentMethodId: string;
}

export const postSubscriptionUserCandidate = async (data: postSubscriptionUserCandidateProps) => {
  const res = await api.post(`/subscription/user/candidate`, data);
  return res.data;
};
