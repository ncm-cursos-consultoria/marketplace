import { api } from "../api";

export interface SendRecoveryCodeRequest {
    email: string;
}

export const sendRecoveryCode = async (data: SendRecoveryCodeRequest): Promise<void> => {
    await api.post("/auth/forgot-my-password",
        null,
        { params: { email: data.email } }
    );
};