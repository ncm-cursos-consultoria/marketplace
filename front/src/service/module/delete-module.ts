import { api } from "../api";

export async function deleteModule(id: string) {
  try {
    await api.delete(`/module/${id}`);
  } catch (error) {
    console.error("Error deleting module:", error);
    throw error;
  }
}