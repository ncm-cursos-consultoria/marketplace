import { api } from "../../api";

export interface UpdateUserMentor {
  firstName: string,
  lastName?: string,
  email: string,
  password?: string,
}

export async function putUserMentor(id: string, updateData: UpdateUserMentor) {

  try {
    const { data } = await api.put(`/user/mentor/${id}`, updateData);
    return data;
  } catch (error) {
    console.error("update mentor user:", error);
    throw error;
  }
}