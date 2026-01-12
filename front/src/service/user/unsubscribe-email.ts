import { api } from "../api";

export const unsubscribeEmail = async (email: string) => {
  return await api.patch(`/user/candidate/${encodeURIComponent(email)}/unsubscribe-email`);
};