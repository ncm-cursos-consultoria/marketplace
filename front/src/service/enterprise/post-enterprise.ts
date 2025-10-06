import { api } from "../api";

interface postEnterpriseProps {
  legalName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  password: string;
}

export const postEnterprise = async (data: postEnterpriseProps) => {
  try {
    const res = await api.post("/enterprise/with-user", data);
    return res.data
  } catch (err: any) {
    console.log(err);
    throw new Error("error create enterprise");
  }
};
