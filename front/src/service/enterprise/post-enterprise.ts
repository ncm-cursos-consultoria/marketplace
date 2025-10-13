import { api } from "../api";

interface postEnterpriseProps {
  legalName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  password: string;
}

export const postEnterprise = async (data: postEnterpriseProps) => {
  const res = await api.post(`/enterprise/with-user`, data);
  return res.data;
};
