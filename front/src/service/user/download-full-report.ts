import { api } from "../api";

export const downloadFullReport = async (userId?: string) => {
    try {
        const res = await api.get(`/user/candidate/${userId}/download-full-report`,
            {
                responseType: 'blob'
            });
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Erro ao baixar o relatório completo do usuário");
    }
};
