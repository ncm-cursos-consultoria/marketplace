// service/user/patch-profile-picture.ts
import { api } from "../api";

export async function patchProfilePicture(file: File, userId: string) {
  console.log("patchProfilePicture - iniciando");
  console.log("patchProfilePicture - file:", file);
  console.log("patchProfilePicture - userId:", userId);
  
  const fd = new FormData();
  fd.append("file", file);
  fd.append("fileType", "PROFILE_PICTURE");

  console.log("patchProfilePicture - FormData criado");
  console.log("file ->", fd.get('file'));
  console.log("fileType ->", fd.get("fileType"));
  
  try {
    const { data } = await api.patch(`/user/${userId}/upload`, fd);
    console.log("patchProfilePicture - sucesso:", data);
    return data;
  } catch (error) {
    console.error("patchProfilePicture - erro:", error);
    throw error;
  }
}