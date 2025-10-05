import { api } from "../api";

interface loginProps {
  email: string;
  password: string;
}

export const login = async (data: loginProps) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err: any) {
    console.log(err);
    throw new Error("Error to login");
  }
};
