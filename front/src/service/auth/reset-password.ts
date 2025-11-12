import { api } from "../api";

export interface ResetPasswordRequest {
  email: string;
  fourDigitCode: string;
  newPassword: string;
}

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await api.patch("/auth/reset-password-by-code", data);
};